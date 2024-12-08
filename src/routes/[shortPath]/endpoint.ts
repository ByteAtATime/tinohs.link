import type { EndpointHandler } from '$lib/server/endpoints';
import type { IURLRepository } from '$lib/server/types/url';
import { json, redirect } from '@sveltejs/kit';
import type { RouteParams } from './$types';

export const endpoint_GET: EndpointHandler<{
	urlRepository: IURLRepository;
	params: RouteParams;
}> = async ({ urlRepository, params }) => {
	const shortPath = params.shortPath;

	if (!shortPath) {
		return json({ error: 'Short path is required' }, { status: 400 });
	}

	const destinationURL = await urlRepository.getURLFromShortPath(shortPath);

	if (!destinationURL) {
		return json({ error: 'Not found' }, { status: 404 });
	}

	redirect(302, destinationURL);
};
