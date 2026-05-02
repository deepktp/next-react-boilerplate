import { config } from 'dotenv';
import { resolve, join } from 'path';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import { Logger } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';

function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    const pkgPath = join(dir, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.workspaces) return dir;
      } catch {
        // malformed package.json — keep walking up
      }
    }
    const parent = resolve(dir, '..');
    if (parent === dir) {
      throw new Error('Cannot find monorepo root (no package.json with workspaces found)');
    }
    dir = parent;
  }
}

const MONOREPO_ROOT = findMonorepoRoot(__dirname);
config({ path: resolve(MONOREPO_ROOT, '.env.development') });

const poolConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Optionally add SSL for production
if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

export const db = drizzle(pool, { schema, mode: 'default' });

pool
  .getConnection()
  .then((conn) => {
    Logger.log('Database connection successful', 'Database');
    conn.release();
  })
  .catch((error) => {
    Logger.error('Database connection failed', error, 'Database');
  });

// Single-connection client for migrations
export const getMigrationClient = () =>
  mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'app_db',
    multipleStatements: true,
    ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
  });
