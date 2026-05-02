import {
  mysqlTable,
  varchar,
  timestamp,
  json,
  mysqlEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

export const tenants = mysqlTable(
  'tenants',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    tenantType: mysqlEnum('tenant_type', ['STANDARD', 'ENTERPRISE', 'SYSTEM'])
      .notNull()
      .default('STANDARD'),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    status: mysqlEnum('status', ['active', 'invited', 'pending', 'suspended'])
      .notNull()
      .default('active'),
    contactEmail: varchar('contact_email', { length: 255 }),
    contactPhone: varchar('contact_phone', { length: 20 }),
    address: varchar('address', { length: 500 }),
    logoUrl: varchar('logo_url', { length: 500 }),
    settings: json('settings').notNull().default({}),
    metadata: json('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('tenants_slug_unique').on(table.slug),
    index('tenants_status_idx').on(table.status),
    index('tenants_type_idx').on(table.tenantType),
  ],
);

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
