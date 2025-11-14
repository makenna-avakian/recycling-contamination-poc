import { IPickupRepository } from '../../../domain/repositories/IPickupRepository';
import { Pickup } from '../../../domain/entities/Pickup';
import { getDatabasePool } from '../connection';

export class PickupRepository implements IPickupRepository {
  async findAll(): Promise<Pickup[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        pickup_id,
        container_id,
        route_id,
        pickup_time,
        weight_kg,
        driver_name,
        notes,
        created_at
      FROM pickups
      ORDER BY pickup_time DESC
    `);

    return result.rows.map(row => new Pickup(
      row.pickup_id,
      row.container_id,
      row.route_id,
      new Date(row.pickup_time),
      row.weight_kg ? parseFloat(row.weight_kg) : null,
      row.driver_name,
      row.notes,
      new Date(row.created_at)
    ));
  }

  async findById(pickupId: number): Promise<Pickup | null> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        pickup_id,
        container_id,
        route_id,
        pickup_time,
        weight_kg,
        driver_name,
        notes,
        created_at
      FROM pickups
      WHERE pickup_id = $1
    `, [pickupId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new Pickup(
      row.pickup_id,
      row.container_id,
      row.route_id,
      new Date(row.pickup_time),
      row.weight_kg ? parseFloat(row.weight_kg) : null,
      row.driver_name,
      row.notes,
      new Date(row.created_at)
    );
  }

  async findByRouteId(routeId: number): Promise<Pickup[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        pickup_id,
        container_id,
        route_id,
        pickup_time,
        weight_kg,
        driver_name,
        notes,
        created_at
      FROM pickups
      WHERE route_id = $1
      ORDER BY pickup_time DESC
    `, [routeId]);

    return result.rows.map(row => new Pickup(
      row.pickup_id,
      row.container_id,
      row.route_id,
      new Date(row.pickup_time),
      row.weight_kg ? parseFloat(row.weight_kg) : null,
      row.driver_name,
      row.notes,
      new Date(row.created_at)
    ));
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Pickup[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        pickup_id,
        container_id,
        route_id,
        pickup_time,
        weight_kg,
        driver_name,
        notes,
        created_at
      FROM pickups
      WHERE pickup_time >= $1 AND pickup_time <= $2
      ORDER BY pickup_time ASC
    `, [startDate, endDate]);

    return result.rows.map(row => new Pickup(
      row.pickup_id,
      row.container_id,
      row.route_id,
      new Date(row.pickup_time),
      row.weight_kg ? parseFloat(row.weight_kg) : null,
      row.driver_name,
      row.notes,
      new Date(row.created_at)
    ));
  }
}

