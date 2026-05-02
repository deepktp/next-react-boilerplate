import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { organizations } from './organizations';
import { users } from './users';
import { roles } from './roles';

export const organizationUsers = mysqlTable(
  'organization_users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    organizationId: varchar('organization_id', { length: 36 })
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    userId: varchar('user_id', { length: 36 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    roleId: varchar('role_id', { length: 36 })
      .references(() => roles.id, { onDelete: 'restrict' })
      .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    assignedBy: varchar('assigned_by', { length: 36 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    assignedAt: timestamp('assigned_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('org_users_org_user_unique').on(table.organizationId, table.userId),
    index('org_users_org_id_idx').on(table.organizationId),
    index('org_users_user_id_idx').on(table.userId),
  ],
);

export type OrganizationUser = typeof organizationUsers.$inferSelect;
export type NewOrganizationUser = typeof organizationUsers.$inferInsert;
