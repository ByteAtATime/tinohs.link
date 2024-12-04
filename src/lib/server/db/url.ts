import { db } from '$lib/server/db';
import { urlMappings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getURLFromShortPath = async (shortPath: string) => {
	const results = await db.select({ redirect: urlMappings.redirectUrl }).from(urlMappings).where(eq(urlMappings.shortUrl, shortPath));

	if (results.length === 0) {
		return null;
	}

	if (results.length > 1) {
		throw new Error('Multiple URLs found for short path');
	}

	return results[0].redirect;
}
