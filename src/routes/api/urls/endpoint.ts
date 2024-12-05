import type { EndpointHandler } from '$lib/server/endpoints';
import type { IURLRepository } from '$lib/server/types/url';
import { json } from '@sveltejs/kit';
import { type InsertUrlSchema, selectUrlSchema } from '$lib/server/url';
import type { IAuthProvider } from '$lib/server/types/auth';

export const endpoint_GET: EndpointHandler<{ urlRepository: IURLRepository }> = async ({
	urlRepository
}) => {
	try {
		const urls = await urlRepository.getAllURLs();
		const validatedUrls = selectUrlSchema.array().parse(urls);

		return json(validatedUrls);
	} catch (e) {
		console.error(e);
		return json({ error: 'An error occurred' }, { status: 500 });
	}
};

export const endpoint_POST: EndpointHandler<{
	urlRepository: IURLRepository;
	body: InsertUrlSchema;
	auth: IAuthProvider;
}> = async ({ urlRepository, body, auth }) => {
	const creator = await auth.getUserId();

	if (!auth.isAuthenticated() || !creator) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const currentUrl = await urlRepository.getURLFromShortPath(body.id);

	if (currentUrl) {
		return json({ error: "Short URL already exists" }, { status: 409 })
	}

	try {
		const newUrlId = await urlRepository.insertURL(body.redirectUrl, body.id, creator);

		return json(newUrlId, { status: 201 });
	} catch (e) {
		console.error(e);
		return json({ error: 'An error occurred' }, { status: 500 });
	}
};

/**
 * async (data, { locals: { auth } }) => {
 * 		if (!auth.userId) {
 * 			return json({ error: 'Unauthorized' }, { status: 401 });
 * 		}
 *
 * 		try {
 * 			const { redirectUrl, id } = data;
 * 			const { id: createdId } = await insertURL(redirectUrl, id);
 *
 * 			return json({ id: createdId }, { status: 201 });
 * 		} catch (e) {
 * 			console.error(e);
 * 			return json({ error: 'An error occurred' }, { status: 500 });
 * 		}
 * 	}
 */
