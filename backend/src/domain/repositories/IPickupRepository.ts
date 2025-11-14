import { Pickup } from '../entities/Pickup';

export interface IPickupRepository {
  findAll(): Promise<Pickup[]>;
  findById(pickupId: number): Promise<Pickup | null>;
  findByRouteId(routeId: number): Promise<Pickup[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Pickup[]>;
}

