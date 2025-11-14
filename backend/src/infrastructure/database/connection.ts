import { Pool } from 'pg';

/**
 * Database Connection Pool
 * Infrastructure layer - handles external concerns (PostgreSQL)
 */
let pool: Pool | null = null;

export function getDatabasePool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'recycling_contamination',
      user: process.env.DB_USER || process.env.USER,
      password: process.env.DB_PASSWORD || '',
    });
  }
  return pool;
}

export async function closeDatabasePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

