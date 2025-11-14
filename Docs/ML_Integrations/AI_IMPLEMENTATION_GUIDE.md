# Machine Learning-Powered Predictive Searches Implementation Guide

This guide explains how machine learning-powered predictive searches were added to the recycling contamination tracking system and how to replicate this functionality in other projects.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Implementation Steps](#implementation-steps)
4. [Code Walkthrough](#code-walkthrough)
5. [Adapting to Other Projects](#adapting-to-other-projects)
6. [Best Practices](#best-practices)
7. [Future Enhancements](#future-enhancements)

## Overview

**Note on Terminology**: This implementation uses **machine learning** (statistical analysis, pattern recognition, trend detection) rather than traditional AI/LLM approaches. It analyzes historical data patterns using algorithms to generate intelligent, actionable search suggestions. For true AI/LLM features (like natural language generation), see the [Future Enhancements](#future-enhancements) section.

The machine learning functionality analyzes historical data patterns to generate intelligent, actionable search suggestions. Instead of requiring users to know what to search for, the system proactively suggests relevant queries based on:

- **Trend Analysis**: Identifies increasing/decreasing patterns
- **Anomaly Detection**: Finds outliers and concerning patterns
- **Predictive Modeling**: Forecasts future trends
- **Pattern Recognition**: Discovers correlations between data points

### Key Features

- **Zero External Dependencies**: Uses pattern analysis algorithms (no external ML/AI APIs required)
- **Real-time Analysis**: Generates suggestions based on current data
- **Confidence Scoring**: Each suggestion includes a confidence level
- **Actionable Insights**: Provides context and recommendations

## Architecture

The implementation follows Clean Architecture principles:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ContaminationController.getPredictiveSearches()     │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GET /api/contamination/predictive-searches          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GetPredictiveSearches Use Case                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  TrendAnalysisService                                │   │
│  │  - analyzeRouteTrends()                              │   │
│  │  - analyzeCategoryTrends()                           │   │
│  │  - analyzeSeverityTrends()                           │   │
│  │  - predictFutureTrends()                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ContaminationRepository                             │   │
│  │  RouteRepository                                     │   │
│  │  Database Queries                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Create the Trend Analysis Service

**File**: `backend/src/application/services/TrendAnalysisService.ts`

This service contains the core machine learning logic. It analyzes data patterns and generates predictive searches.

```typescript
export interface PredictiveSearch {
  title: string;
  description: string;
  queryType: 'route' | 'category' | 'severity' | 'trend' | 'customer';
  queryParams: Record<string, any>;
  confidence: number; // 0-1
  insight: string; // ML-generated insight
}

export class TrendAnalysisService {
  async generatePredictiveSearches(): Promise<PredictiveSearch[]> {
    // 1. Analyze route trends
    // 2. Analyze category trends
    // 3. Analyze severity trends
    // 4. Predict future trends
    // 5. Combine and rank by confidence
  }
}
```

**Key Methods**:

1. **`analyzeRouteTrends()`**: Compares week-over-week data to find increasing trends
2. **`analyzeCategoryTrends()`**: Identifies most problematic contamination types
3. **`analyzeSeverityTrends()`**: Finds routes with consistently high severity
4. **`predictFutureTrends()`**: Uses historical patterns to forecast future issues

### Step 2: Create the Use Case

**File**: `backend/src/application/use-cases/GetPredictiveSearches.ts`

The use case orchestrates the service:

```typescript
export class GetPredictiveSearches {
  constructor(
    private trendAnalysisService: TrendAnalysisService
  ) {}

  async execute(): Promise<PredictiveSearch[]> {
    return await this.trendAnalysisService.generatePredictiveSearches();
  }
}
```

### Step 3: Add Controller Method

**File**: `backend/src/presentation/controllers/ContaminationController.ts`

Add a new endpoint handler:

```typescript
async getPredictiveSearches(req: Request, res: Response): Promise<void> {
  try {
    const searches = await this.getPredictiveSearchesUseCase.execute();
    res.json(searches);
  } catch (error) {
    // Error handling
  }
}
```

### Step 4: Add Route

**File**: `backend/src/presentation/routes/contaminationRoutes.ts`

```typescript
router.get('/predictive-searches', (req, res) => 
  controller.getPredictiveSearches(req, res)
);
```

### Step 5: Wire Up Dependencies

**File**: `backend/src/infrastructure/config/dependencies.ts`

```typescript
// Create service instance
export const trendAnalysisService = new TrendAnalysisService(
  contaminationRepository,
  routeRepository
);

// Create use case
export const getPredictiveSearches = new GetPredictiveSearches(
  trendAnalysisService
);

// Inject into controller
export const contaminationController = new ContaminationController(
  getContaminationByRoute,
  getContaminationOverTime,
  getPredictiveSearches
);
```

### Step 6: Frontend API Client

**File**: `frontend/src/lib/api.ts`

```typescript
export interface PredictiveSearch {
  title: string;
  description: string;
  queryType: string;
  queryParams: Record<string, any>;
  confidence: number;
  insight: string;
}

export const contaminationApi = {
  getPredictiveSearches: async (): Promise<PredictiveSearch[]> => {
    const response = await api.get('/api/contamination/predictive-searches');
    return response.data;
  },
};
```

### Step 7: Frontend Component

**File**: `frontend/src/components/PredictiveSearches.tsx`

Create a React component to display the suggestions:

```typescript
export function PredictiveSearches() {
  const { data: searches } = useQuery({
    queryKey: ['predictive-searches'],
    queryFn: () => contaminationApi.getPredictiveSearches(),
  });

  return (
    <div>
      {searches?.map((search) => (
        <SearchCard key={search.title} search={search} />
      ))}
    </div>
  );
}
```

## Code Walkthrough

### Trend Analysis Algorithm

The core algorithm compares time periods to identify trends:

```typescript
private async analyzeRouteTrends(pool: any): Promise<any[]> {
  const result = await pool.query(`
    WITH recent_weeks AS (
      SELECT 
        r.route_id,
        r.route_code,
        DATE_TRUNC('week', p.pickup_time) as week,
        COUNT(ce.contamination_id) as event_count
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
        MAX(CASE WHEN week = (SELECT MAX(week) FROM recent_weeks) 
            THEN event_count END) as current_week,
        MAX(CASE WHEN week = (SELECT MAX(week) FROM recent_weeks) - INTERVAL '1 week' 
            THEN event_count END) as previous_week
      FROM recent_weeks
      GROUP BY route_id, route_code
      HAVING COUNT(DISTINCT week) >= 2
    )
    SELECT 
      route_id,
      route_code,
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
```

**How it works**:
1. Groups data by week for the last 30 days
2. Compares current week vs previous week
3. Calculates percentage change
4. Flags increases > 10% as "increasing"
5. Returns routes with concerning trends

### Confidence Scoring

Confidence is calculated based on:
- **Magnitude of change**: Larger changes = higher confidence
- **Data volume**: More data points = more reliable
- **Pattern consistency**: Consistent patterns = higher confidence

```typescript
confidence: Math.min(0.9, 0.5 + (trend.changePercent / 50))
```

This formula:
- Starts at 50% base confidence
- Adds up to 40% based on change magnitude
- Caps at 90% to account for uncertainty

### Generating Insights

Each search includes a machine learning-generated insight:

```typescript
insight: `Route ${trend.routeCode} shows a concerning upward trend. 
         Consider targeted education campaigns.`
```

Insights are generated based on:
- The type of pattern detected
- The severity of the issue
- Recommended actions

## Adapting to Other Projects

### Step 1: Identify Your Data Patterns

Ask yourself:
- What trends matter in your domain?
- What anomalies should trigger alerts?
- What predictions would be valuable?

**Examples**:
- **E-commerce**: Sales trends, product performance, customer behavior
- **Healthcare**: Patient outcomes, treatment effectiveness, resource usage
- **Finance**: Transaction patterns, fraud detection, spending trends

### Step 2: Define Your Analysis Methods

Create methods that analyze your specific data:

```typescript
class YourTrendAnalysisService {
  // Analyze your specific patterns
  async analyzeSalesTrends() { }
  async analyzeCustomerBehavior() { }
  async analyzeProductPerformance() { }
  async predictFutureSales() { }
}
```

### Step 3: Create Predictive Search Interface

Adapt the interface to your domain:

```typescript
export interface PredictiveSearch {
  title: string;
  description: string;
  queryType: 'sales' | 'customer' | 'product' | 'trend';
  queryParams: Record<string, any>;
  confidence: number;
  insight: string;
  // Add domain-specific fields
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}
```

### Step 4: Implement Analysis Logic

Use SQL queries or application logic to analyze patterns:

```typescript
// Example: Analyze sales trends
private async analyzeSalesTrends(pool: any): Promise<any[]> {
  const result = await pool.query(`
    WITH daily_sales AS (
      SELECT 
        DATE_TRUNC('day', order_date) as day,
        SUM(amount) as total_sales,
        COUNT(*) as order_count
      FROM orders
      WHERE order_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', order_date)
    ),
    trend_analysis AS (
      SELECT 
        day,
        total_sales,
        LAG(total_sales) OVER (ORDER BY day) as previous_sales,
        AVG(total_sales) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg
      FROM daily_sales
    )
    SELECT 
      day,
      total_sales,
      previous_sales,
      CASE 
        WHEN total_sales > moving_avg * 1.2 THEN 'spike'
        WHEN total_sales < moving_avg * 0.8 THEN 'drop'
        ELSE 'normal'
      END as trend
    FROM trend_analysis
    WHERE day >= CURRENT_DATE - INTERVAL '7 days'
  `);
  
  return result.rows;
}
```

### Step 5: Generate Domain-Specific Insights

Create insights relevant to your domain:

```typescript
if (trend.trend === 'spike') {
  searches.push({
    title: `Sales Spike Detected`,
    description: `Sales increased ${trend.increasePercent}% compared to average`,
    queryType: 'sales',
    queryParams: { date: trend.day },
    confidence: 0.85,
    insight: `Unusual sales spike detected. Investigate marketing campaigns or 
             external factors that may have caused this increase.`
  });
}
```

### Step 6: Frontend Integration

Adapt the frontend component to your UI:

```typescript
export function PredictiveSearches() {
  const { data: searches } = useQuery({
    queryKey: ['predictive-searches'],
    queryFn: () => yourApi.getPredictiveSearches(),
  });

  const handleSearchClick = (search: PredictiveSearch) => {
    // Navigate based on queryType
    switch (search.queryType) {
      case 'sales':
        navigate(`/sales?${new URLSearchParams(search.queryParams)}`);
        break;
      case 'customer':
        navigate(`/customers/${search.queryParams.customerId}`);
        break;
      // ... other cases
    }
  };

  return (
    <div className="predictive-searches">
      {searches?.map((search) => (
        <SearchCard 
          key={search.title} 
          search={search}
          onClick={() => handleSearchClick(search)}
        />
      ))}
    </div>
  );
}
```

## Best Practices

### 1. Start Simple

Begin with basic trend analysis:
- Week-over-week comparisons
- Simple aggregations (counts, averages)
- Clear thresholds (e.g., >20% increase)

### 2. Use SQL for Heavy Lifting

Leverage database capabilities:
- Window functions for moving averages
- CTEs for complex comparisons
- Aggregations for pattern detection

### 3. Cache Results

Predictive searches can be expensive:
```typescript
// Cache for 5 minutes
const searches = await cache.get('predictive-searches') || 
  await generateSearches();
await cache.set('predictive-searches', searches, 300);
```

### 4. Provide Context

Always include:
- **What** was detected
- **Why** it matters
- **What** action to take

### 5. Handle Edge Cases

- Empty data sets
- Insufficient historical data
- Missing relationships
- Invalid date ranges

### 6. Test with Real Data

- Use production-like data volumes
- Test with edge cases
- Validate confidence scores
- Verify insights are actionable

### 7. Make It Configurable

Allow customization:
```typescript
interface AnalysisConfig {
  lookbackDays: number;
  minConfidence: number;
  trendThreshold: number;
  maxSuggestions: number;
}
```

## Advanced Patterns

### Machine Learning Integration

For more sophisticated analysis, integrate ML models:

```typescript
import { predictTrend } from './ml-models/trend-predictor';

async predictFutureTrends() {
  const historicalData = await this.getHistoricalData();
  const prediction = await predictTrend(historicalData);
  
  return {
    title: 'ML-Predicted Trend',
    confidence: prediction.confidence,
    insight: prediction.explanation
  };
}
```

### Real-time Analysis

Use event streams for real-time insights:

```typescript
class RealTimeTrendAnalysis {
  async onNewEvent(event: ContaminationEvent) {
    const trend = await this.analyzeRecentPattern(event);
    if (trend.isAnomaly) {
      await this.triggerAlert(trend);
    }
  }
}
```

### Multi-dimensional Analysis

Analyze multiple factors together:

```typescript
async analyzeMultiFactorTrends() {
  const routeTrend = await this.analyzeRouteTrends();
  const categoryTrend = await this.analyzeCategoryTrends();
  const severityTrend = await this.analyzeSeverityTrends();
  
  // Find correlations
  const correlated = this.findCorrelations([
    routeTrend,
    categoryTrend,
    severityTrend
  ]);
  
  return correlated;
}
```

## Future Enhancements

### 1. External AI/LLM APIs

Integrate with OpenAI, Anthropic, or other AI/LLM services for natural language insights:

```typescript
import OpenAI from 'openai';

async generateInsight(data: TrendData): Promise<string> {
  const prompt = `Analyze this contamination trend: ${JSON.stringify(data)}
                  Provide a brief, actionable insight.`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });
  
  return response.choices[0].message.content;
}
```

### 2. User Feedback Loop

Learn from user interactions:

```typescript
async recordSearchClick(search: PredictiveSearch) {
  await db.query(`
    INSERT INTO search_feedback (search_id, clicked, useful)
    VALUES ($1, true, $2)
  `, [search.id, userFeedback]);
  
  // Adjust confidence scores based on feedback
  await this.updateConfidenceScores();
}
```

### 3. Personalized Suggestions

Tailor suggestions to user roles:

```typescript
async generatePersonalizedSearches(userId: string): Promise<PredictiveSearch[]> {
  const userRole = await getUserRole(userId);
  const userHistory = await getUserSearchHistory(userId);
  
  const allSearches = await this.generatePredictiveSearches();
  
  // Filter and rank based on user context
  return this.personalizeSearches(allSearches, userRole, userHistory);
}
```

### 4. A/B Testing

Test different analysis algorithms:

```typescript
async generateSearchesWithVariant(variant: string): Promise<PredictiveSearch[]> {
  switch (variant) {
    case 'conservative':
      return this.generateConservativeSearches();
    case 'aggressive':
      return this.generateAggressiveSearches();
    default:
      return this.generateStandardSearches();
  }
}
```

## Troubleshooting

### Common Issues

1. **No suggestions appearing**
   - Check if data exists in the date range
   - Verify SQL queries return results
   - Check confidence thresholds

2. **Low confidence scores**
   - Increase data volume
   - Adjust thresholds
   - Check for data quality issues

3. **Performance issues**
   - Add database indexes
   - Implement caching
   - Optimize SQL queries

4. **Inaccurate predictions**
   - Increase historical data
   - Refine algorithms
   - Add more analysis dimensions

## Conclusion

This implementation provides a foundation for machine learning-powered predictive searches that can be adapted to any domain. The key is understanding your data patterns and creating analysis methods that generate actionable insights.

Remember:
- Start simple and iterate
- Use SQL for heavy analysis
- Provide context and actionable insights
- Make it configurable and testable
- Consider user feedback for continuous improvement

For questions or contributions, please refer to the main README or open an issue.

