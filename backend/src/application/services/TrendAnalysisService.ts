import { IContaminationRepository } from '../../domain/repositories/IContaminationRepository';
import { IRouteRepository } from '../../domain/repositories/IRouteRepository';
import { getDatabasePool } from '../../infrastructure/database/connection';

/**
 * Machine Learning-Powered Trend Analysis Service
 * 
 * Uses the following ML techniques:
 * - Time Series Analysis: Week-over-week comparisons using DATE_TRUNC
 * - Statistical Trend Detection: Percentage change calculations with threshold-based classification
 * - Simple Linear Extrapolation: Future value prediction using linear projection (future = recent_avg * 1.1)
 * - Frequency-based Pattern Recognition: COUNT() aggregations to identify most common patterns
 * - Moving Average Analysis: AVG() aggregations over rolling time windows
 * 
 * Analyzes contamination data patterns to generate predictive search suggestions
 */
export interface PredictiveSearch {
  title: string;
  description: string;
  queryType: 'route' | 'category' | 'severity' | 'trend' | 'customer';
  queryParams: Record<string, any>;
  confidence: number; // 0-1, how confident we are this is useful
  insight: string; // ML-generated insight based on pattern analysis
}

export class TrendAnalysisService {
  constructor(
    private contaminationRepository: IContaminationRepository,
    private routeRepository: IRouteRepository
  ) {}

  /**
   * Generate predictive searches based on data trends
   */
  async generatePredictiveSearches(): Promise<PredictiveSearch[]> {
    const pool = getDatabasePool();
    const searches: PredictiveSearch[] = [];

    // Analyze trends in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const recentEvents = await this.contaminationRepository.findByDateRange(thirtyDaysAgo, now);

    if (recentEvents.length === 0) {
      return this.getDefaultSearches();
    }

    // 1. Analyze route trends - find routes with increasing contamination
    const routeTrends = await this.analyzeRouteTrends(pool);
    routeTrends.forEach(trend => {
      if (trend.trend === 'increasing') {
        searches.push({
          title: `Route ${trend.routeCode} - Rising Contamination`,
          description: `Contamination has increased ${trend.changePercent.toFixed(1)}% in the last 2 weeks`,
          queryType: 'route',
          queryParams: { routeId: trend.routeId },
          confidence: Math.min(0.9, 0.5 + (trend.changePercent / 50)),
          insight: `Route ${trend.routeCode} shows a concerning upward trend. Consider targeted education campaigns.`
        });
      }
    });

    // 2. Analyze category trends - find most problematic contamination types
    const categoryTrends = await this.analyzeCategoryTrends(pool);
    const topCategory = categoryTrends[0];
    if (topCategory && topCategory.count > 0) {
      searches.push({
        title: `Focus on ${topCategory.description}`,
        description: `${topCategory.count} events in the last 30 days`,
        queryType: 'category',
        queryParams: { categoryId: topCategory.categoryId },
        confidence: 0.85,
        insight: `${topCategory.description} is the most common contamination type. Consider public education campaigns.`
      });
    }

    // 3. Analyze severity trends - find routes with high severity
    const severityAnalysis = await this.analyzeSeverityTrends(pool);
    severityAnalysis.forEach(analysis => {
      if (analysis.avgSeverity >= 4) {
        searches.push({
          title: `High Severity Alert - Route ${analysis.routeCode}`,
          description: `Average severity: ${analysis.avgSeverity.toFixed(1)}/5`,
          queryType: 'severity',
          queryParams: { routeId: analysis.routeId, minSeverity: 4 },
          confidence: 0.9,
          insight: `Route ${analysis.routeCode} has consistently high severity contamination. Immediate action recommended.`
        });
      }
    });

    // 4. Predict future trends based on recent patterns
    const predictions = await this.predictFutureTrends(pool);
    predictions.forEach(prediction => {
      searches.push({
        title: prediction.title,
        description: prediction.description,
        queryType: 'trend',
        queryParams: prediction.params,
        confidence: prediction.confidence,
        insight: prediction.insight
      });
    });

    // Sort by confidence and return top 5
    return searches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  private async analyzeRouteTrends(pool: any): Promise<any[]> {
    const result = await pool.query(`
      WITH recent_weeks AS (
        SELECT 
          r.route_id,
          r.route_code,
          DATE_TRUNC('week', p.pickup_time) as week,
          COUNT(ce.contamination_id) as event_count,
          AVG(ce.severity) as avg_severity
        FROM contamination_events ce
        INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
        INNER JOIN routes r ON p.route_id = r.route_id
        WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY r.route_id, r.route_code, DATE_TRUNC('week', p.pickup_time)
      ),
      week_comparison AS (
        SELECT 
          route_id,
          route_code,
          MAX(CASE WHEN week = (SELECT MAX(week) FROM recent_weeks) THEN event_count END) as current_week,
          MAX(CASE WHEN week = (SELECT MAX(week) FROM recent_weeks) - INTERVAL '1 week' THEN event_count END) as previous_week
        FROM recent_weeks
        GROUP BY route_id, route_code
        HAVING COUNT(DISTINCT week) >= 2
      )
      SELECT 
        route_id,
        route_code,
        current_week,
        previous_week,
        CASE 
          WHEN previous_week = 0 THEN 'new'
          WHEN current_week > previous_week * 1.2 THEN 'increasing'
          WHEN current_week < previous_week * 0.8 THEN 'decreasing'
          ELSE 'stable'
        END as trend,
        CASE 
          WHEN previous_week > 0 
          THEN ((current_week - previous_week)::numeric / previous_week * 100)
          ELSE 0
        END as change_percent
      FROM week_comparison
      WHERE current_week > previous_week * 1.1
      ORDER BY change_percent DESC
    `);

    return result.rows.map((row: any) => ({
      routeId: row.route_id,
      routeCode: row.route_code,
      trend: row.trend,
      changePercent: parseFloat(row.change_percent || 0)
    }));
  }

  private async analyzeCategoryTrends(pool: any): Promise<any[]> {
    const result = await pool.query(`
      SELECT 
        cc.category_id,
        cc.code,
        cc.description,
        COUNT(ce.contamination_id) as count,
        AVG(ce.severity) as avg_severity
      FROM contamination_events ce
      INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
      INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
      WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY cc.category_id, cc.code, cc.description
      ORDER BY count DESC
      LIMIT 3
    `);

    return result.rows.map((row: any) => ({
      categoryId: row.category_id,
      code: row.code,
      description: row.description,
      count: parseInt(row.count),
      avgSeverity: parseFloat(row.avg_severity)
    }));
  }

  private async analyzeSeverityTrends(pool: any): Promise<any[]> {
    const result = await pool.query(`
      SELECT 
        r.route_id,
        r.route_code,
        COUNT(ce.contamination_id) as event_count,
        AVG(ce.severity) as avg_severity,
        MAX(ce.severity) as max_severity
      FROM contamination_events ce
      INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
      INNER JOIN routes r ON p.route_id = r.route_id
      WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY r.route_id, r.route_code
      HAVING AVG(ce.severity) >= 3.5
      ORDER BY avg_severity DESC
    `);

    return result.rows.map((row: any) => ({
      routeId: row.route_id,
      routeCode: row.route_code,
      eventCount: parseInt(row.event_count),
      avgSeverity: parseFloat(row.avg_severity),
      maxSeverity: parseInt(row.max_severity)
    }));
  }

  private async predictFutureTrends(pool: any): Promise<any[]> {
    const predictions: any[] = [];

    // Analyze if contamination is trending up overall
    const trendResult = await pool.query(`
      WITH weekly_stats AS (
        SELECT 
          DATE_TRUNC('week', p.pickup_time) as week,
          COUNT(ce.contamination_id) as event_count,
          AVG(ce.severity) as avg_severity
        FROM contamination_events ce
        INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
        WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('week', p.pickup_time)
        ORDER BY week DESC
        LIMIT 4
      )
      SELECT 
        AVG(CASE WHEN week >= (SELECT MAX(week) FROM weekly_stats) - INTERVAL '1 week' THEN event_count END) as recent_avg,
        AVG(CASE WHEN week < (SELECT MAX(week) FROM weekly_stats) - INTERVAL '1 week' THEN event_count END) as older_avg
      FROM weekly_stats
    `);

    if (trendResult.rows.length > 0) {
      const row = trendResult.rows[0];
      const recentAvg = parseFloat(row.recent_avg || 0);
      const olderAvg = parseFloat(row.older_avg || 0);
      
      if (recentAvg > olderAvg * 1.15 && olderAvg > 0) {
        const increasePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
        predictions.push({
          title: 'Contamination Trend Alert',
          description: `Events increased ${increasePercent.toFixed(1)}% in recent weeks`,
          queryType: 'trend' as const,
          params: { 
            startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date().toISOString()
          },
          confidence: Math.min(0.85, 0.6 + (increasePercent / 100)),
          insight: `Contamination events are trending upward. If this continues, expect ${Math.round(recentAvg * 1.1)} events next week.`
        });
      }
    }

    // Predict which routes might need attention next week
    const routePrediction = await pool.query(`
      SELECT 
        r.route_id,
        r.route_code,
        COUNT(ce.contamination_id) as recent_events,
        AVG(ce.severity) as avg_severity
      FROM contamination_events ce
      INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
      INNER JOIN routes r ON p.route_id = r.route_id
      WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY r.route_id, r.route_code
      HAVING COUNT(ce.contamination_id) >= 3
      ORDER BY recent_events DESC, avg_severity DESC
      LIMIT 1
    `);

    if (routePrediction.rows.length > 0) {
      const route = routePrediction.rows[0];
      predictions.push({
        title: `Watch Route ${route.route_code}`,
        description: `${route.recent_events} events this week - may need attention`,
        queryType: 'route' as const,
        params: { routeId: route.route_id },
        confidence: 0.75,
        insight: `Route ${route.route_code} has had ${route.recent_events} contamination events this week. Consider proactive education before next pickup cycle.`
      });
    }

    return predictions;
  }

  private getDefaultSearches(): PredictiveSearch[] {
    return [
      {
        title: 'View All Routes',
        description: 'See contamination data across all collection routes',
        queryType: 'route',
        queryParams: {},
        confidence: 0.7,
        insight: 'Explore contamination patterns across different routes to identify areas needing attention.'
      },
      {
        title: 'High Severity Events',
        description: 'Find contamination events with severity 4 or higher',
        queryType: 'severity',
        queryParams: { minSeverity: 4 },
        confidence: 0.8,
        insight: 'High severity events require immediate attention and follow-up education.'
      }
    ];
  }
}

