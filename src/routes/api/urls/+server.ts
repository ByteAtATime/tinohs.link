import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { urlMappings } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const urls = await db.select().from(urlMappings);

	return json(urls);
}
