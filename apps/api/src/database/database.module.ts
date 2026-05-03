import { Module, Global } from '@nestjs/common';

// Token for injecting the Drizzle db instance
export const DB_TOKEN = 'DRIZZLE_DB';

@Global()
@Module({
  providers: [
    {
      provide: DB_TOKEN,
      useFactory: async () => {
        // Lazily import to ensure env vars are loaded first
        const { db } = await import('../../database/db');
        return db;
      },
    },
  ],
  exports: [DB_TOKEN],
})
export class DatabaseModule {}
