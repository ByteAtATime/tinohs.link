import { db } from '$lib/server/db';
import { urlMappings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import type { IURLRepository } from '$lib/server/types/url';

export const selectUrlSchema = createSelectSchema(urlMappings, {
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});
export type SelectUrlSchema = z.infer<typeof selectUrlSchema>;

export const insertUrlSchema = createInsertSchema(urlMappings);
export type InsertUrlSchema = z.infer<typeof insertUrlSchema>;

export class PostgresURLRepository implements IURLRepository {
	async getURLFromShortPath(shortPath: string) {
		const results = await db
			.select({ redirect: urlMappings.redirectUrl })
			.from(urlMappings)
			.where(eq(urlMappings.id, shortPath));

		if (results.length === 0) {
			return null;
		}

		if (results.length > 1) {
			throw new Error('Multiple URLs found for short path');
		}

		return results[0].redirect;
	}

	async getAllURLs() {
		return db.select().from(urlMappings);
	}

	async insertURL(url: string, shortPath: string, creator: string, name?: string) {
		const insertedRows = await db
			.insert(urlMappings)
			.values({ redirectUrl: url, id: shortPath, owner: creator, name })
			.returning();

		if (insertedRows.length !== 1) {
			throw new Error('Failed to insert URL');
		}

		return insertedRows[0].id;
	}

	async getURLSOwnedBy(owner: string) {
		return db.select().from(urlMappings).where(eq(urlMappings.owner, owner));
	}
}
