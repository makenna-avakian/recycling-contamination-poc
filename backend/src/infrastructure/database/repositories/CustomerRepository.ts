import { ICustomerRepository } from '../../../domain/repositories/ICustomerRepository';
import { Customer } from '../../../domain/entities/Customer';
import { getDatabasePool } from '../connection';

export class CustomerRepository implements ICustomerRepository {
  async findAll(): Promise<Customer[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        customer_id,
        external_ref,
        name,
        customer_type,
        route_id,
        address_line1,
        city,
        state,
        postal_code,
        active,
        created_at
      FROM customers
      WHERE active = true
      ORDER BY name
    `);

    return result.rows.map(row => new Customer(
      row.customer_id,
      row.external_ref,
      row.name,
      row.customer_type,
      row.route_id,
      row.address_line1,
      row.city,
      row.state,
      row.postal_code,
      row.active,
      new Date(row.created_at)
    ));
  }

  async findById(customerId: number): Promise<Customer | null> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        customer_id,
        external_ref,
        name,
        customer_type,
        route_id,
        address_line1,
        city,
        state,
        postal_code,
        active,
        created_at
      FROM customers
      WHERE customer_id = $1
    `, [customerId]);

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return new Customer(
      row.customer_id,
      row.external_ref,
      row.name,
      row.customer_type,
      row.route_id,
      row.address_line1,
      row.city,
      row.state,
      row.postal_code,
      row.active,
      new Date(row.created_at)
    );
  }

  async findByRouteId(routeId: number): Promise<Customer[]> {
    const pool = getDatabasePool();
    const result = await pool.query(`
      SELECT 
        customer_id,
        external_ref,
        name,
        customer_type,
        route_id,
        address_line1,
        city,
        state,
        postal_code,
        active,
        created_at
      FROM customers
      WHERE route_id = $1 AND active = true
      ORDER BY name
    `, [routeId]);

    return result.rows.map(row => new Customer(
      row.customer_id,
      row.external_ref,
      row.name,
      row.customer_type,
      row.route_id,
      row.address_line1,
      row.city,
      row.state,
      row.postal_code,
      row.active,
      new Date(row.created_at)
    ));
  }
}

