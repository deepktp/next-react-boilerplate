import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'drizzle-kit';

config({ path: resolve(__dirname, '../../.env.development') });

export default defineConfig({
  schema: './database/schema/index.ts',
  out: './database/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'app_db',
  },
});
