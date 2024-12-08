import type { RequestHandler } from './$types';
import { insertUrlSchema } from '$lib/server/url';
import {
	endpoint,
	withAuthProvider,
	withBodySchema,
	withURLRepository
} from '$lib/server/endpoints';
import { endpoint_GET, endpoint_POST } from './endpoint';

export const GET: RequestHandler = endpoint(withAuthProvider(withURLRepository(endpoint_GET)));

export const POST: RequestHandler = endpoint(
	withURLRepository(
		withAuthProvider(withBodySchema(insertUrlSchema.omit({ owner: true }), endpoint_POST))
	)
);
