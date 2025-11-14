import { IContaminationRepository } from '../../../domain/repositories/IContaminationRepository';
import { ContaminationEvent } from '../../../domain/entities/ContaminationEvent';
import { getDatabasePool } from '../connection';

/**
 * Infrastructure Implementation of ContaminationRepository
 * Handles actual database queries
 */
export class ContaminationRepository implements IContaminationRepository {
  async findAll(): Promise<ContaminationEvent[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        contamination_id,
        pickup_id,
        category_id,
        severity,
        estimated_contamination_pct,
        notes,
        created_at
      FROM contamination_events
      ORDER BY created_at DESC
    `);

    return result.rows.map(row => new ContaminationEvent(
      row.contamination_id,
      row.pickup_id,
      row.category_id,
      row.severity,
      parseFloat(row.estimated_contamination_pct),
      row.notes,
      new Date(row.created_at)
    ));
  }

  async findByPickupId(pickupId: number): Promise<ContaminationEvent[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        contamination_id,
        pickup_id,
        category_id,
        severity,
        estimated_contamination_pct,
        notes,
        created_at
      FROM contamination_events
      WHERE pickup_id = $1
      ORDER BY severity DESC
    `, [pickupId]);

    return result.rows.map(row => new ContaminationEvent(
      row.contamination_id,
      row.pickup_id,
      row.category_id,
      row.severity,
      parseFloat(row.estimated_contamination_pct),
      row.notes,
      new Date(row.created_at)
    ));
  }

  async findByRouteId(routeId: number): Promise<ContaminationEvent[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        ce.contamination_id,
        ce.pickup_id,
        ce.category_id,
        ce.severity,
        ce.estimated_contamination_pct,
        ce.notes,
        ce.created_at
      FROM contamination_events ce
      INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
      WHERE p.route_id = $1
      ORDER BY ce.created_at DESC
    `, [routeId]);

    return result.rows.map(row => new ContaminationEvent(
      row.contamination_id,
      row.pickup_id,
      row.category_id,
      row.severity,
      parseFloat(row.estimated_contamination_pct),
      row.notes,
      new Date(row.created_at)
    ));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ContaminationEvent[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        ce.contamination_id,
        ce.pickup_id,
        ce.category_id,
        ce.severity,
        ce.estimated_contamination_pct,
        ce.notes,
        ce.created_at
      FROM contamination_events ce
      INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
      WHERE p.pickup_time >= $1 AND p.pickup_time <= $2
      ORDER BY p.pickup_time ASC
    `, [startDate, endDate]);

    return result.rows.map(row => new ContaminationEvent(
      row.contamination_id,
      row.pickup_id,
      row.category_id,
      row.severity,
      parseFloat(row.estimated_contamination_pct),
      row.notes,
      new Date(row.created_at)
    ));
  }
}

