import { endpoint, withURLRepository } from '$lib/server/endpoints';
import type { RequestHandler } from './$types';
import { endpoint_GET } from './endpoint';

export const GET: RequestHandler = endpoint(withURLRepository(endpoint_GET))
