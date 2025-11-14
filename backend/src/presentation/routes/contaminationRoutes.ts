import { Router } from 'express';
import { ContaminationController } from '../controllers/ContaminationController';

export function createContaminationRoutes(controller: ContaminationController): Router {
  const router = Router();

  router.get('/route/:routeId', (req, res) => controller.getByRoute(req, res));
  router.get('/over-time', (req, res) => controller.getOverTime(req, res));

  return router;
}

