import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number | null;
}

export interface IDatabase {
  query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
  getClient(): Promise<pg.PoolClient>;
  close(): Promise<void>;
  isHealthy(): Promise<boolean>;
}

class PostgresDatabase implements IDatabase {
  private pool: pg.Pool;

  constructor() {
    this.pool = new Pool(
      env.DATABASE_URL
        ? { connectionString: env.DATABASE_URL }
        : {
            host: env.DB_HOST,
            port: env.DB_PORT,
            database: env.DB_NAME,
            user: env.DB_USER,
            password: env.DB_PASSWORD,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          }
    );

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });
  }

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const res = await this.pool.query(text, params);
    return {
      rows: res.rows,
      rowCount: res.rowCount,
    };
  }

  async getClient(): Promise<pg.PoolClient> {
    return await this.pool.connect();
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  async isHealthy(): Promise<boolean> {
    try {
      const res = await this.pool.query('SELECT 1 as ping');
      return res.rows[0]?.ping === 1;
    } catch {
      return false;
    }
  }
}

export const db: IDatabase = new PostgresDatabase();
