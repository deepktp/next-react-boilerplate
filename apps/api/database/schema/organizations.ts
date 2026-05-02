import {
  mysqlTable,
  varchar,
  timestamp,
  boolean,
  mysqlEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';
import { tenants } from './tenants';

export const organizations = mysqlTable(
  'organizations',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 36 })
      .references(() => tenants.id, { onDelete: 'cascade' })
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    orgType: mysqlEnum('org_type', ['INDIVIDUAL', 'COMPANY', 'PARTNERSHIP', 'LLP', 'TRUST', 'OTHER'])
      .notNull()
      .default('COMPANY'),
    description: varchar('description', { length: 500 }),
    website: varchar('website', { length: 255 }),
    addressLine1: varchar('address_line_1', { length: 255 }),
    addressLine2: varchar('address_line_2', { length: 255 }),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    postalCode: varchar('postal_code', { length: 20 }),
    contactPerson: varchar('contact_person', { length: 255 }),
    contactEmail: varchar('contact_email', { length: 255 }),
    contactPhone: varchar('contact_phone', { length: 20 }),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('organizations_tenant_id_idx').on(table.tenantId),
    uniqueIndex('organizations_name_tenant_unique').on(table.name, table.tenantId),
  ],
);

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
