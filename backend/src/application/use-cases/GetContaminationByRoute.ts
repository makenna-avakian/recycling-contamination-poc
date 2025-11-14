import { IContaminationRepository } from '../../domain/repositories/IContaminationRepository';
import { ContaminationEvent } from '../../domain/entities/ContaminationEvent';

/**
 * Use Case: Get Contamination by Route
 * Application layer - orchestrates domain logic
 */
export class GetContaminationByRoute {
  constructor(
    private contaminationRepository: IContaminationRepository
  ) {}

  async execute(routeId: number): Promise<ContaminationEvent[]> {
    return await this.contaminationRepository.findByRouteId(routeId);
  }
}

