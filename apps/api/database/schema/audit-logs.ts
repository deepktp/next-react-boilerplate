import {
  mysqlTable,
  varchar,
  timestamp,
  json,
  mysqlEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { tenants } from './tenants';
import { users } from './users';

export const auditLogs = mysqlTable(
  'audit_logs',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 36 }).references(() => tenants.id, {
      onDelete: 'set null',
    }),
    actorUserId: varchar('actor_user_id', { length: 36 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    action: mysqlEnum('action', [
      'create',
      'update',
      'delete',
      'export',
      'import',
      'login',
      'logout',
    ]).notNull(),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    entityId: varchar('entity_id', { length: 36 }),
    beforeData: json('before_data'),
    afterData: json('after_data'),
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: varchar('user_agent', { length: 500 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('audit_logs_tenant_id_idx').on(table.tenantId),
    index('audit_logs_actor_user_id_idx').on(table.actorUserId),
    index('audit_logs_entity_type_idx').on(table.entityType),
    index('audit_logs_created_at_idx').on(table.createdAt),
  ],
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
