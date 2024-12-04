import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getAllURLs, insertURL, insertUrlSchema, selectUrlSchema } from '$lib/server/db/url';
import { validateSchema } from '$lib/validation';

export const GET: RequestHandler = async () => {
	try {
		const urls = await getAllURLs();
		const validatedUrls = selectUrlSchema.array().parse(urls);

		return json(validatedUrls);
	} catch (e) {
		console.error(e);
		return json({ error: 'An error occurred' }, { status: 500 });
	}
};

export const POST: RequestHandler = validateSchema(
	insertUrlSchema,
	async (data, { locals: { auth } }) => {
		if (!auth.userId) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		try {
			const { redirectUrl, id } = data;
			const { id: createdId } = await insertURL(redirectUrl, id);

			return json({ id: createdId }, { status: 201 });
		} catch (e) {
			console.error(e);
			return json({ error: 'An error occurred' }, { status: 500 });
		}
	}
);
