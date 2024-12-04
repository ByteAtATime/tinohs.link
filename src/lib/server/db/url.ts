import { db } from '$lib/server/db';
import { urlMappings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const selectUrlSchema = createSelectSchema(urlMappings, {
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date()
});
export type SelectUrlSchema = z.infer<typeof selectUrlSchema>;

export const insertUrlSchema = createInsertSchema(urlMappings);
export type InsertUrlSchema = z.infer<typeof insertUrlSchema>;

export const getURLFromShortPath = async (shortPath: string) => {
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
};

export const getAllURLs = async () => {
	return db.select().from(urlMappings);
};

export const insertURL = async (url: string, shortPath: string) => {
	return (await db.insert(urlMappings).values({ redirectUrl: url, id: shortPath }).returning())[0];
};
