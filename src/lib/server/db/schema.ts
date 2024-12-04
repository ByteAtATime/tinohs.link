import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const urlMappings = pgTable('url_mappings', {
	id: text('id').primaryKey(),
	redirectUrl: text('redirect_url').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});
