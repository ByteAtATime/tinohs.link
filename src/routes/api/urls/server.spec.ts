import { afterAll, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './+server';
import { selectUrlSchema, type SelectUrlSchema } from '$lib/server/db/url';

const mocks = vi.hoisted(() => ({
	getAllURLs: vi.fn(),
	insertURL: vi.fn()
}));
vi.mock('$lib/server/db/url', async (importOriginal) => ({
	...(await importOriginal()),
	getAllURLs: mocks.getAllURLs,
	insertURL: mocks.insertURL
}));

afterAll(() => {
	mocks.getAllURLs.mockReset();
	mocks.insertURL.mockReset();
});

describe('/api/urls', () => {
	describe('GET', () => {
		it('should return all URLs', async () => {
			const mockURLs = [
				{
					id: '00000000-0000-0000-0000-000000000000',
					shortUrl: 'short',
					redirectUrl: 'redirect',
					createdAt: new Date(),
					updatedAt: new Date()
				}
			] satisfies SelectUrlSchema[];

			mocks.getAllURLs.mockResolvedValue(mockURLs);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await GET({} as any);

			expect(response.status).toBe(200);

			const rawBody = await response.json();
			const parsed = selectUrlSchema.array().safeParse(rawBody);

			expect(parsed.success).toBe(true);
			expect(parsed.data).toEqual(mockURLs);
		});

		it('should return 500 if getAllURLs throws', async () => {
			mocks.getAllURLs.mockRejectedValue(new Error('Fake error in getAllURLs()'));

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await GET({} as any);
			expect(response.status).toBe(500);

			const body = await response.json();
			expect(body).toEqual({ error: 'An error occurred' });
		});
	});

	describe('POST', () => {
		it('should return 401 if not authenticated', async () => {
			const request = new Request('http://localhost:5173/api/urls', {
				method: 'POST',
				body: JSON.stringify({ redirectUrl: 'redirect', shortUrl: 'short' })
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await POST({ locals: { auth: {} }, request } as any);
			expect(response.status).toBe(401);

			const body = await response.json();
			expect(body).toEqual({ error: 'Unauthorized' });
		});

		it('should return 400 if missing redirectUrl', async () => {
			const request = new Request('http://localhost:5173/api/urls', {
				method: 'POST',
				body: JSON.stringify({ shortUrl: 'short' })
			});
			const response = await POST({
				locals: { auth: { userId: '00000000-0000-0000-0000-000000000000' } },
				request
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any);
			expect(response.status).toBe(400);

			const body = await response.json();
			expect(body).toEqual({
				error: 'Validation failed',
				errors: [{ message: 'Required', path: 'redirectUrl' }]
			});
		});

		it('should return 400 if missing shortUrl', async () => {
			const request = new Request('http://localhost:5173/api/urls', {
				method: 'POST',
				body: JSON.stringify({ redirectUrl: 'redirect' })
			});
			const response = await POST({
				locals: { auth: { userId: '00000000-0000-0000-0000-000000000000' } },
				request
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any);
			expect(response.status).toBe(400);

			const body = await response.json();
			expect(body).toEqual({
				error: 'Validation failed',
				errors: [{ message: 'Required', path: 'shortUrl' }]
			});
		});

		it('should return 500 if insertURL throws', async () => {
			mocks.insertURL.mockRejectedValue(new Error('Fake error in insertURL()'));
			const request = new Request('http://localhost:5173/api/urls', {
				method: 'POST',
				body: JSON.stringify({ redirectUrl: 'redirect', shortUrl: 'short' })
			});
			const response = await POST({
				locals: { auth: { userId: '00000000-0000-0000-0000-000000000000' } },
				request
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any);
			expect(response.status).toBe(500);

			const body = await response.json();
			expect(body).toEqual({ error: 'An error occurred' });
		});

		it('should return 201 if successful', async () => {
			mocks.insertURL.mockResolvedValue('00000000-0000-0000-0000-000000000000');
			const request = new Request('http://localhost:5173/api/urls', {
				method: 'POST',
				body: JSON.stringify({ redirectUrl: 'redirect', shortUrl: 'short' })
			});
			const response = await POST({
				locals: { auth: { userId: '00000000-0000-0000-0000-000000000000' } },
				request
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any);
			expect(response.status).toBe(201);

			const body = await response.json();
			expect(body).toEqual({ id: '00000000-0000-0000-0000-000000000000' });
		});
	});
});
