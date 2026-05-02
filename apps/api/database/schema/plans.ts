import {
  mysqlTable,
  varchar,
  int,
  decimal,
  json,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

export const plans = mysqlTable(
  'plans',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    description: varchar('description', { length: 500 }),
    priceMonthly: decimal('price_monthly', { precision: 10, scale: 2 }).default('0'),
    priceYearly: decimal('price_yearly', { precision: 10, scale: 2 }).default('0'),
    maxOrganizations: int('max_organizations').default(1),
    maxUsers: int('max_users').default(5),
    features: json('features').notNull().default({}),
    isActive: boolean('is_active').default(true).notNull(),
    displayOrder: int('display_order').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [uniqueIndex('plans_slug_unique').on(table.slug)],
);

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
