import { Route } from '../entities/Route';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(routeId: number): Promise<Route | null>;
}

