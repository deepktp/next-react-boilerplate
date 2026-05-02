import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  text,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

export const permissions = mysqlTable('permissions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  resource: varchar('resource', { length: 100 }).notNull(),
  action: mysqlEnum('action', ['create', 'read', 'update', 'delete', 'manage', 'execute']).notNull(),
  isSystem: boolean('is_system').default(true).notNull(),
  scope: mysqlEnum('scope', ['platform', 'tenant', 'organization']).default('tenant'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
