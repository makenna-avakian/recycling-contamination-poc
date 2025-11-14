import { Customer } from '../entities/Customer';

export interface ICustomerRepository {
  findAll(): Promise<Customer[]>;
  findById(customerId: number): Promise<Customer | null>;
  findByRouteId(routeId: number): Promise<Customer[]>;
}

