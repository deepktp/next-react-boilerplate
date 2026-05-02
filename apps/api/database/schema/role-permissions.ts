import { mysqlTable, varchar, timestamp, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { roles } from './roles';
import { permissions } from './permissions';

export const rolePermissions = mysqlTable(
  'role_permissions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    roleId: varchar('role_id', { length: 36 })
      .references(() => roles.id, { onDelete: 'cascade' })
      .notNull(),
    permissionId: varchar('permission_id', { length: 36 })
      .references(() => permissions.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('role_permissions_unique').on(table.roleId, table.permissionId),
    index('role_permissions_role_id_idx').on(table.roleId),
    index('role_permissions_permission_id_idx').on(table.permissionId),
  ],
);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
