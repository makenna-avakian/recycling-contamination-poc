import { IRouteRepository } from '../../../domain/repositories/IRouteRepository';
import { Route } from '../../../domain/entities/Route';
import { getDatabasePool } from '../connection';

export class RouteRepository implements IRouteRepository {
  async findAll(): Promise<Route[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        route_id,
        facility_id,
        route_code,
        description,
        active,
        created_at
      FROM routes
      WHERE active = true
      ORDER BY route_code
    `);

    return result.rows.map(row => new Route(
      row.route_id,
      row.facility_id,
      row.route_code,
      row.description,
      row.active,
      new Date(row.created_at)
    ));
  }

  async findById(routeId: number): Promise<Route | null> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        route_id,
        facility_id,
        route_code,
        description,
        active,
        created_at
      FROM routes
      WHERE route_id = $1
    `, [routeId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new Route(
      row.route_id,
      row.facility_id,
      row.route_code,
      row.description,
      row.active,
      new Date(row.created_at)
    );
  }
}

