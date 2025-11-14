import { TrendAnalysisService, PredictiveSearch } from '../services/TrendAnalysisService';

/**
 * Use Case: Get Predictive Searches
 * Returns AI-generated search suggestions based on data trends
 */
export class GetPredictiveSearches {
  constructor(
    private trendAnalysisService: TrendAnalysisService
  ) {}

  async execute(): Promise<PredictiveSearch[]> {
    return await this.trendAnalysisService.generatePredictiveSearches();
  }
}

