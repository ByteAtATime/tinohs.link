import type { RequestHandler } from './$types';
import { getURLFromShortPath } from '$lib/server/db/url';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const shortPath = params.shortPath;
	const destinationURL = await getURLFromShortPath(shortPath);

	if (!destinationURL) {
		error(404, 'Not found');
	}

	redirect(302, destinationURL);
};