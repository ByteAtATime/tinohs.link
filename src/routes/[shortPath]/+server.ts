import { endpoint, withRouteParams, withURLRepository } from '$lib/server/endpoints';
import type { RequestHandler } from './$types';
import { endpoint_GET } from './endpoint';

export const GET: RequestHandler = endpoint(withURLRepository(withRouteParams(endpoint_GET)));
