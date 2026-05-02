import { mysqlTable, varchar, timestamp, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { users } from './users';
import { tenants } from './tenants';
import { roles } from './roles';

export const userTenantRoles = mysqlTable(
  'user_tenant_roles',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    tenantId: varchar('tenant_id', { length: 36 })
      .references(() => tenants.id, { onDelete: 'cascade' })
      .notNull(),
    roleId: varchar('role_id', { length: 36 })
      .references(() => roles.id, { onDelete: 'restrict' })
      .notNull(),
    assignedBy: varchar('assigned_by', { length: 36 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_tenant_roles_unique').on(table.userId, table.tenantId, table.roleId),
    index('user_tenant_roles_user_tenant_idx').on(table.userId, table.tenantId),
    index('user_tenant_roles_tenant_id_idx').on(table.tenantId),
  ],
);

export type UserTenantRole = typeof userTenantRoles.$inferSelect;
export type NewUserTenantRole = typeof userTenantRoles.$inferInsert;
