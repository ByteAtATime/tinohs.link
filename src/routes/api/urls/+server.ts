import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAllURLs, selectUrlSchema } from '$lib/server/db/url';

export const GET: RequestHandler = async () => {
	try {
		const urls = await getAllURLs();
		const validatedUrls = selectUrlSchema.array().parse(urls);

		return json(validatedUrls);
	} catch (e) {
		console.error(e);
		return json({ error: 'An error occurred' }, { status: 500 });
	}
}
