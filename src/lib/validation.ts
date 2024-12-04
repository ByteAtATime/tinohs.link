import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

export function validateSchema<T extends z.ZodType>(
	schema: T,
	handler: (data: z.infer<T>, event: RequestEvent) => Promise<Response>
) {
	return async (event: RequestEvent) => {
		try {
			const body = await event.request.json();
			const data = schema.parse(body);
			return await handler(data, event);
		} catch (error) {
			// JSON parse error
			if (error instanceof SyntaxError) {
				return json(
					{
						error: 'Invalid JSON',
						details: error.message
					},
					{ status: 400 }
				);
			}

			// Zod validation error
			if (error instanceof z.ZodError) {
				return json(
					{
						error: 'Validation failed',
						errors: error.errors.map((err) => ({
							path: err.path.join('.'),
							message: err.message
						}))
					},
					{ status: 400 }
				);
			}

			// Log unexpected errors
			console.error('Unexpected error:', error);

			// Generic error for everything else
			return json(
				{
					error: 'Internal server error',
					message:
						process.env.NODE_ENV === 'development'
							? error instanceof Error
								? error.message
								: String(error)
							: 'An unexpected error occurred'
				},
				{ status: 500 }
			);
		}
	};
}
