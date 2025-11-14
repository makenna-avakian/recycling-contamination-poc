import { Pool } from 'pg';

/**
 * Database Connection Pool
 * Infrastructure layer - handles external concerns (PostgreSQL)
 */
let pool: Pool | null = null;

export function getDatabasePool(): Pool {
  if (!pool) {
    // Handle $USER environment variable expansion
    let dbUser = process.env.DB_USER;
    if (dbUser === '$USER' || !dbUser) {
      dbUser = process.env.USER || require('os').userInfo().username;
    }
    
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'recycling_contamination',
      user: dbUser,
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

