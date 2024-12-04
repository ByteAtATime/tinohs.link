import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';

export const urlMappings = pgTable('url_mappings', {
	id: uuid('id').primaryKey().defaultRandom(),
	redirectUrl: text('redirect_url').notNull(),
	shortUrl: text('short_url').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
