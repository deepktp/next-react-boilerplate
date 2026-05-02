import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  int,
  text,
  mysqlEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/mysql-core';
import type { AnyMySqlColumn } from 'drizzle-orm/mysql-core';
import { tenants } from './tenants';

export const roles = mysqlTable(
  'roles',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 36 }).references(() => tenants.id, {
      onDelete: 'cascade',
    }),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    description: text('description'),
    scope: mysqlEnum('scope', ['platform', 'tenant', 'organization']).notNull().default('tenant'),
    level: int('level').notNull().default(4),
    isSystem: boolean('is_system').default(false).notNull(),
    parentRoleId: varchar('parent_role_id', { length: 36 }).references(
      (): AnyMySqlColumn => roles.id,
      { onDelete: 'set null' },
    ),
    status: mysqlEnum('status', ['active', 'invited', 'pending', 'suspended'])
      .notNull()
      .default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('roles_slug_tenant_unique').on(table.slug, table.tenantId),
    index('roles_tenant_id_idx').on(table.tenantId),
    index('roles_parent_role_id_idx').on(table.parentRoleId),
  ],
);

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
