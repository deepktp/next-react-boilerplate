import { mysqlTable, varchar, timestamp, boolean, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { users } from './users';

export const passwordResetTokens = mysqlTable(
  'password_reset_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tokenHash: varchar('token_hash', { length: 64 }).notNull(),
    used: boolean('used').default(false).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('password_reset_tokens_hash_unique').on(table.tokenHash),
    index('password_reset_tokens_user_id_idx').on(table.userId),
  ],
);

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
