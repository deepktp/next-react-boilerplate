import {
  mysqlTable,
  varchar,
  json,
  timestamp,
  mysqlEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/mysql-core';

export const settings = mysqlTable(
  'settings',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    scope: mysqlEnum('scope', ['system', 'tenant', 'organization']).notNull().default('tenant'),
    scopeId: varchar('scope_id', { length: 36 }),
    key: varchar('key', { length: 100 }).notNull(),
    value: json('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex('settings_scope_key_unique').on(table.scope, table.scopeId, table.key),
    index('settings_scope_id_idx').on(table.scopeId),
  ],
);

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
