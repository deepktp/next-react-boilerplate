import {
  mysqlTable,
  varchar,
  timestamp,
  json,
  boolean,
  mysqlEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/mysql-core';
import { tenants } from './tenants';

export const users = mysqlTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 36 }).references(() => tenants.id, {
      onDelete: 'restrict',
    }),
    email: varchar('email', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }).notNull(),
    lastName: varchar('last_name', { length: 100 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    isSuperAdmin: boolean('is_super_admin').default(false).notNull(),
    status: mysqlEnum('status', ['active', 'invited', 'pending', 'suspended'])
      .notNull()
      .default('active'),
    emailVerified: boolean('email_verified').default(false).notNull(),
    lastLoginAt: timestamp('last_login_at'),
    avatar: varchar('avatar', { length: 500 }),
    phone: varchar('phone', { length: 20 }),
    metadata: json('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('users_email_tenant_unique').on(table.email, table.tenantId),
    index('users_tenant_id_idx').on(table.tenantId),
    index('users_email_idx').on(table.email),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
