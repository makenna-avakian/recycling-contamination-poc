import { PredictiveSearch } from '../services/TrendAnalysisService';
import { MLTrendAnalysisService } from '../services/MLTrendAnalysisService';

/**
 * Use Case: Get Predictive Searches
 * Returns SARIMA ML model-generated search suggestions based on predictive trend analysis
 */
export class GetPredictiveSearches {
  constructor(
    private mlTrendAnalysisService: MLTrendAnalysisService
  ) {}

  async execute(): Promise<PredictiveSearch[]> {
    return await this.mlTrendAnalysisService.generatePredictiveSearches();
  }
}
