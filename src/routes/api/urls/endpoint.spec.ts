import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { selectUrlSchema, type InsertUrlSchema, type SelectUrlSchema } from '$lib/server/url';
import { endpoint_GET, endpoint_POST } from './endpoint';
import { MockURLRepository } from '$lib/server/mocks/url';
import { MockAuthProvider } from '$lib/server/mocks/auth';
import { withBodySchema } from '$lib/server/endpoints';

describe('/api/urls', () => {
	describe('GET', () => {
		it('should return all URLs', async () => {
			const mockUrlRepository = new MockURLRepository();

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_GET({ urlRepository: mockUrlRepository }, {} as any);

			expect(response.status).toBe(200);

			const rawBody = await response.json();
			const parsed = selectUrlSchema.array().safeParse(rawBody);

			expect(parsed.success).toBe(true);
			expect(parsed.data).toEqual([MockURLRepository.MOCK_URL]);
		});

		it('should return 500 if getAllURLs throws', async () => {
			const mockURLRepository = new MockURLRepository();

			mockURLRepository.getAllURLs.mockRejectedValue(new Error('Fake error in getAllURLs()'));

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_GET({ urlRepository: mockURLRepository }, {} as any);
			expect(response.status).toBe(500);

			const body = await response.json();
			expect(body).toEqual({ error: 'An error occurred' });
		});
	});

	describe('POST', () => {
		let mockURLRepository: MockURLRepository;
		let mockAuthProvider: MockAuthProvider;
		let mockBody: InsertUrlSchema;

		let mockDeps: {
			urlRepository: MockURLRepository;
			auth: MockAuthProvider;
			body: InsertUrlSchema;
		}

		beforeEach(() => {
			mockURLRepository = new MockURLRepository();
			mockAuthProvider = new MockAuthProvider();
			mockBody = { id: 'short', redirectUrl: 'redirect' };

			mockDeps = { urlRepository: mockURLRepository, auth: mockAuthProvider, body: mockBody };
		});

		it('should return 401 if not authenticated', async () => {
			mockAuthProvider.isAuthenticated.mockReturnValue(false);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_POST(mockDeps, {} as any);
			expect(response.status).toBe(401);
		
			const body = await response.json();
			expect(body).toEqual({ error: 'Unauthorized' });
		});

			it('should return 500 if insertURL throws', async () => {
				mockURLRepository.insertURL.mockRejectedValue(new Error("Fake error in insertURL()"));
				mockAuthProvider.isAuthenticated.mockReturnValue(true);

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const response = await endpoint_POST(mockDeps, {} as any);

				expect(response.status).toBe(500);
		
				const body = await response.json();
				expect(body).toEqual({ error: 'An error occurred' });
			});
		
		it('should return 201 if successful', async () => {
			mockAuthProvider.isAuthenticated.mockReturnValue(true);

			const response = await endpoint_POST(
				mockDeps,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				{} as any
			);
			expect(response.status).toBe(201);

			const body = await response.json();
			expect(body).toEqual('short');
		});
	});
});
