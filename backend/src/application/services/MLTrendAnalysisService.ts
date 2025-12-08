import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { PredictiveSearch } from './TrendAnalysisService';

const execAsync = promisify(exec);

/**
 * ML-Powered Trend Analysis Service using SARIMA models
 * 
 * This service calls a Python script that uses SARIMA (Seasonal ARIMA) models
 * to predict contamination trends based on historical patterns.
 * 
 * ML Models Used:
 * - SARIMA (Seasonal ARIMA): For time series forecasting with seasonal patterns
 * - Auto-parameter selection: Grid search for optimal (p,d,q)(P,D,Q,s) parameters
 * - Seasonal decomposition: For understanding underlying patterns
 * 
 * Advantages over statistical analysis:
 * - Captures yearly/monthly/weekly seasonality
 * - Handles trends and non-stationary data
 * - Provides confidence intervals
 * - More accurate predictions for time series data
 */
export class MLTrendAnalysisService {
  private pythonScriptPath: string;

  constructor() {
    // Path to Python SARIMA predictor script
    // Resolve from project root (backend/ml_service/)
    const projectRoot = path.resolve(__dirname, '../../../');
    this.pythonScriptPath = path.join(projectRoot, 'ml_service', 'sarima_predictor.py');
  }

  /**
   * Generate predictive searches using SARIMA models
   */
  async generatePredictiveSearches(): Promise<PredictiveSearch[]> {
    try {
      // Set environment variables for database connection
      const env = {
        ...process.env,
        DB_NAME: process.env.DB_NAME || 'recycling_contamination',
        DB_USER: process.env.DB_USER || 'mavakian',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_HOST: process.env.DB_HOST || 'localhost',
        DB_PORT: process.env.DB_PORT || '5432',
      };

      // Call Python script
      const { stdout, stderr } = await execAsync(
        `python3 "${this.pythonScriptPath}"`,
        { env, maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
      );

      if (stderr && !stderr.includes('warnings')) {
        console.warn('Python ML service warnings:', stderr);
      }

      // Parse JSON response
      const searches = JSON.parse(stdout) as PredictiveSearch[];

      // Validate response structure
      if (!Array.isArray(searches)) {
        throw new Error('Invalid response from ML service: expected array');
      }

      return searches;
    } catch (error) {
      console.error('Error calling ML service:', error);
      
      // Fallback to default searches if ML service fails
      return this.getDefaultSearches();
    }
  }

  /**
   * Fallback default searches when ML service is unavailable
   */
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

