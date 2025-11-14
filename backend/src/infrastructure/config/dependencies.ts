/**
 * Dependency Injection Container
 * Creates and wires up all dependencies following Clean Architecture
 */

import { IContaminationRepository } from '../../domain/repositories/IContaminationRepository';
import { IPickupRepository } from '../../domain/repositories/IPickupRepository';
import { ICustomerRepository } from '../../domain/repositories/ICustomerRepository';
import { IRouteRepository } from '../../domain/repositories/IRouteRepository';

import { ContaminationRepository } from '../database/repositories/ContaminationRepository';
import { PickupRepository } from '../database/repositories/PickupRepository';
import { CustomerRepository } from '../database/repositories/CustomerRepository';
import { RouteRepository } from '../database/repositories/RouteRepository';

import { GetContaminationByRoute } from '../../application/use-cases/GetContaminationByRoute';
import { GetContaminationOverTime } from '../../application/use-cases/GetContaminationOverTime';
import { GetWorstOffendingCustomers } from '../../application/use-cases/GetWorstOffendingCustomers';
import { GetPredictiveSearches } from '../../application/use-cases/GetPredictiveSearches';
import { TrendAnalysisService } from '../../application/services/TrendAnalysisService';

import { ContaminationController } from '../../presentation/controllers/ContaminationController';

/**
 * Infrastructure Layer: Repository Implementations
 */
export const contaminationRepository: IContaminationRepository = new ContaminationRepository();
export const pickupRepository: IPickupRepository = new PickupRepository();
export const customerRepository: ICustomerRepository = new CustomerRepository();
export const routeRepository: IRouteRepository = new RouteRepository();

/**
 * Application Layer: Use Cases
 */
export const getContaminationByRoute = new GetContaminationByRoute(contaminationRepository);
export const getContaminationOverTime = new GetContaminationOverTime(contaminationRepository);
export const getWorstOffendingCustomers = new GetWorstOffendingCustomers(
  customerRepository,
  contaminationRepository,
  pickupRepository
);

/**
 * Application Layer: Machine Learning Services
 */
export const trendAnalysisService = new TrendAnalysisService(
  contaminationRepository,
  routeRepository
);
export const getPredictiveSearches = new GetPredictiveSearches(trendAnalysisService);

/**
 * Presentation Layer: Controllers
 */
export const contaminationController = new ContaminationController(
  getContaminationByRoute,
  getContaminationOverTime,
  getPredictiveSearches
);

