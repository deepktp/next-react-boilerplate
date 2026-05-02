import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import { getMigrationClient } from './db';

async function runMigrations() {
  console.log('Running migrations...');
  const connection = await getMigrationClient();
  const db = drizzle(connection);
  await migrate(db, { migrationsFolder: './database/migrations' });
  console.log('Migrations completed!');
  await connection.end();
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Migration failed!', err);
  process.exit(1);
});
