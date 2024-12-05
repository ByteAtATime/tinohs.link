import { z } from 'zod';
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { PostgresURLRepository } from '$lib/server/url';
import type { IURLRepository } from '$lib/server/types/url';
import type { IAuthProvider } from '$lib/server/types/auth';
import { ClerkAuthProvider } from '$lib/server/auth';

export type EndpointHandler<TDeps> = (
	deps: TDeps,
	event: RequestEvent
) => Promise<Response> | Response;

export const endpoint = (handler: EndpointHandler<Record<string, never>>): RequestHandler => {
	return (event) => handler({}, event);
};

export const withBodySchema = <TDeps extends { body: z.infer<TSchema> }, TSchema extends z.ZodType>(
	schema: TSchema,
	handler: EndpointHandler<TDeps>
): EndpointHandler<Omit<TDeps, 'body'>> => {
	return async (deps, event) => {
		let rawBody: unknown;

		try {
			rawBody = await event.request.json();
		} catch (e) {
			if (e instanceof SyntaxError) {
				return json({ error: 'Invalid JSON', details: e.message }, { status: 400 });
			}
			return json({ error: 'Internal server error' }, { status: 500 });
		}

		try {
			const body = schema.parse(rawBody);
			return handler({ ...deps, body } as TDeps, event);
		} catch (e) {
			if (e instanceof z.ZodError) {
				return json(
					{
						error: 'Validation failed',
						errors: e.errors.map((err) => ({
							path: err.path.join('.'),
							message: err.message
						}))
					},
					{ status: 400 }
				);
			}
			return json({ error: 'Internal server error' }, { status: 500 });
		}
	};
};

export const withURLRepository = <TDeps extends { urlRepository: IURLRepository }>(
	handler: EndpointHandler<TDeps>
): EndpointHandler<Omit<TDeps, 'urlRepository'>> => {
	const urlRepository = new PostgresURLRepository();

	return (deps, event) => handler({ ...deps, urlRepository } as TDeps, event);
};

export const withAuthProvider = <TDeps extends { auth: IAuthProvider }>(
	handler: EndpointHandler<TDeps>
): EndpointHandler<Omit<TDeps, 'auth'>> => {
	return async (deps, event) => {
		const auth = new ClerkAuthProvider(event.locals.auth);
		return handler({ ...deps, auth } as unknown as TDeps, event);
	};
};
