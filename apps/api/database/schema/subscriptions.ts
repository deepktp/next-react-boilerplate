import {
  mysqlTable,
  varchar,
  timestamp,
  json,
  mysqlEnum,
  index,
} from 'drizzle-orm/mysql-core';
import { tenants } from './tenants';
import { plans } from './plans';

export const subscriptions = mysqlTable(
  'subscriptions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    tenantId: varchar('tenant_id', { length: 36 })
      .references(() => tenants.id, { onDelete: 'cascade' })
      .notNull(),
    planId: varchar('plan_id', { length: 36 })
      .references(() => plans.id, { onDelete: 'restrict' })
      .notNull(),
    status: mysqlEnum('status', ['active', 'trial', 'past_due', 'cancelled', 'expired'])
      .notNull()
      .default('trial'),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date'),
    trialEndsAt: timestamp('trial_ends_at'),
    cancelledAt: timestamp('cancelled_at'),
    metadata: json('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index('subscriptions_tenant_id_idx').on(table.tenantId),
    index('subscriptions_status_idx').on(table.status),
  ],
);

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
