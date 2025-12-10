import { Router } from 'express';
import { AIGenerationController } from '../controllers/AIGenerationController';

export function createAIRoutes(controller: AIGenerationController): Router {
  const router = Router();

  router.post('/generate-email', (req, res) => controller.generateEmail(req, res));
  router.post('/generate-campaign', (req, res) => controller.generateCampaign(req, res));
  router.get('/status', (req, res) => controller.getStatus(req, res));

  return router;
}

