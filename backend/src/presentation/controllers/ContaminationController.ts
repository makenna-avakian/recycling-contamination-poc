import { Request, Response } from 'express';
import { GetContaminationByRoute } from '../../application/use-cases/GetContaminationByRoute';
import { GetContaminationOverTime } from '../../application/use-cases/GetContaminationOverTime';
import { GetPredictiveSearches } from '../../application/use-cases/GetPredictiveSearches';
import { getDatabasePool } from '../../infrastructure/database/connection';

/**
 * Presentation Layer: Contamination Controller
 * Handles HTTP requests/responses
 */
export class ContaminationController {
  constructor(
    private getContaminationByRoute: GetContaminationByRoute,
    private getContaminationOverTime: GetContaminationOverTime,
    private getPredictiveSearchesUseCase: GetPredictiveSearches
  ) {}

  async getByRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeId = parseInt(req.params.routeId);
      if (isNaN(routeId)) {
        res.status(400).json({ error: 'Invalid route ID' });
        return;
      }

      const contamination = await this.getContaminationByRoute.execute(routeId);
      // Enrich with pickup_time from database (batch query)
      const pool = getDatabasePool();
      const pickupIds = contamination.map(e => e.pickupId);
      const pickupTimes = pickupIds.length > 0 
        ? await pool.query('SELECT pickup_id, pickup_time FROM pickups WHERE pickup_id = ANY($1)', [pickupIds])
        : { rows: [] };
      const pickupTimeMap = new Map(pickupTimes.rows.map((r: any) => [r.pickup_id, r.pickup_time]));
      
      const enriched = contamination.map((event) => ({
        contaminationId: event.contaminationId,
        pickupId: event.pickupId,
        categoryId: event.categoryId,
        severity: event.severity,
        estimatedContaminationPct: event.estimatedContaminationPct,
        notes: event.notes,
        createdAt: event.createdAt.toISOString(),
        pickupTime: pickupTimeMap.get(event.pickupId) || event.createdAt.toISOString()
      }));
      res.json(enriched);
    } catch (error) {
      console.error('Error getting contamination by route:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getOverTime(req: Request, res: Response): Promise<void> {
    try {
      const startDate = req.query.startDate 
        ? new Date(req.query.startDate as string)
        : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); 
      
      const endDate = req.query.endDate 
        ? new Date(req.query.endDate as string)
        : new Date(); // Default: now

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ error: 'Invalid date format' });
        return;
      }

      const contamination = await this.getContaminationOverTime.execute(startDate, endDate);
      // Enrich with pickup_time from database (batch query)
      const pool = getDatabasePool();
      const pickupIds = contamination.map(e => e.pickupId);
      const pickupTimes = pickupIds.length > 0
        ? await pool.query('SELECT pickup_id, pickup_time FROM pickups WHERE pickup_id = ANY($1)', [pickupIds])
        : { rows: [] };
      const pickupTimeMap = new Map(pickupTimes.rows.map((r: any) => [r.pickup_id, r.pickup_time]));
      
      const enriched = contamination.map((event) => ({
        contaminationId: event.contaminationId,
        pickupId: event.pickupId,
        categoryId: event.categoryId,
        severity: event.severity,
        estimatedContaminationPct: event.estimatedContaminationPct,
        notes: event.notes,
        createdAt: event.createdAt.toISOString(),
        pickupTime: pickupTimeMap.get(event.pickupId) || event.createdAt.toISOString()
      }));
      res.json(enriched);
    } catch (error) {
      console.error('Error getting contamination over time:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }

  async getPredictiveSearches(req: Request, res: Response): Promise<void> {
    try {
      const searches = await this.getPredictiveSearchesUseCase.execute();
      res.json(searches);
    } catch (error) {
      console.error('Error getting predictive searches:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  }
}

