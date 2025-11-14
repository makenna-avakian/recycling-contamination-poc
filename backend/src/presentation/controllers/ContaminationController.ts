import { Request, Response } from 'express';
import { GetContaminationByRoute } from '../../application/use-cases/GetContaminationByRoute';
import { GetContaminationOverTime } from '../../application/use-cases/GetContaminationOverTime';

/**
 * Presentation Layer: Contamination Controller
 * Handles HTTP requests/responses
 */
export class ContaminationController {
  constructor(
    private getContaminationByRoute: GetContaminationByRoute,
    private getContaminationOverTime: GetContaminationOverTime
  ) {}

  async getByRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeId = parseInt(req.params.routeId);
      if (isNaN(routeId)) {
        res.status(400).json({ error: 'Invalid route ID' });
        return;
      }

      const contamination = await this.getContaminationByRoute.execute(routeId);
      res.json(contamination);
    } catch (error) {
      console.error('Error getting contamination by route:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getOverTime(req: Request, res: Response): Promise<void> {
    try {
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate as string)
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
      
      const endDate = req.query.endDate 
        ? new Date(req.query.endDate as string)
        : new Date(); // Default: now

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }

      const contamination = await this.getContaminationOverTime.execute(startDate, endDate);
      res.json(contamination);
    } catch (error) {
      console.error('Error getting contamination over time:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

