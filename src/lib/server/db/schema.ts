import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const authProviderEnum = pgEnum('auth_provider', ['clerk']);

export const usersTable = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	authProvider: authProviderEnum('auth_provider').notNull(),
	authProviderId: text('auth_provider_id').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const urlMappings = pgTable('url_mappings', {
	id: text('id').primaryKey(),	
	redirectUrl: text('redirect_url').notNull(),
	owner: uuid('owner').notNull().references(() => usersTable.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
