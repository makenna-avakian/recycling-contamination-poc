import { IContaminationRepository } from '../../domain/repositories/IContaminationRepository';
import { ContaminationEvent } from '../../domain/entities/ContaminationEvent';

/**
 * Use Case: Get Contamination Over Time
 * For analyzing trends
 */
export class GetContaminationOverTime {
  constructor(
    private contaminationRepository: IContaminationRepository
  ) {}

  async execute(startDate: Date, endDate: Date): Promise<ContaminationEvent[]> {
    return await this.contaminationRepository.findByDateRange(startDate, endDate);
  }
}

