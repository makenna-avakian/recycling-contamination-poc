import { ContaminationEvent } from '../entities/ContaminationEvent';

/**
 * Repository Interface (Domain Layer)
 * Defines what operations we need, not how they're implemented
 * Infrastructure layer will implement this
 */
export interface IContaminationRepository {
  findAll(): Promise<ContaminationEvent[]>;
  findByPickupId(pickupId: number): Promise<ContaminationEvent[]>;
  findByRouteId(routeId: number): Promise<ContaminationEvent[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<ContaminationEvent[]>;
}

