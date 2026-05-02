import { mysqlTable, varchar, timestamp, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const refreshTokens = mysqlTable(
  'refresh_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: varchar('token_hash', { length: 64 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('refresh_tokens_hash_unique').on(table.tokenHash),
    index('refresh_tokens_user_id_idx').on(table.userId),
  ],
);

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
