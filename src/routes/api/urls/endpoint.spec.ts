import { beforeEach, describe, expect, it } from 'vitest';
import { selectUrlSchema, type InsertUrlSchema } from '$lib/server/url';
import { endpoint_GET, endpoint_POST } from './endpoint';
import { MockURLRepository } from '$lib/server/mocks/url';
import { MockAuthProvider } from '$lib/server/mocks/auth';

describe('/api/urls', () => {
	describe('GET', () => {
		it('should return URLs with the correct owner', async () => {
			const mockUrlRepository = new MockURLRepository();
			const mockAuthProvider = new MockAuthProvider();
			mockAuthProvider.getUserId.mockResolvedValue(MockURLRepository.MOCK_URL.owner);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_GET({ urlRepository: mockUrlRepository, auth: mockAuthProvider }, {} as any);

			expect(response.status).toBe(200);

			const rawBody = await response.json();
			const parsed = selectUrlSchema.array().safeParse(rawBody);

			expect(parsed.success).toBe(true);
			expect(parsed.data).toEqual([MockURLRepository.MOCK_URL]);
		});

		it("should return 401 if not authenticated", async () => {
			const mockURLRepository = new MockURLRepository();
			const mockAuthProvider = new MockAuthProvider();
			mockAuthProvider.getUserId.mockResolvedValue(null);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_GET({ urlRepository: mockURLRepository, auth: mockAuthProvider }, {} as any);
			expect(response.status).toBe(401);

			const body = await response.json();
			expect(body).toEqual({ error: 'Unauthorized' });
		})

		it("should return an empty array if the user has no URLs", async () => {
			const mockURLRepository = new MockURLRepository();
			const mockAuthProvider = new MockAuthProvider();
			mockAuthProvider.getUserId.mockResolvedValue("00000000-0000-0000-0000-000000000001");

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_GET({ urlRepository: mockURLRepository, auth: mockAuthProvider }, {} as any);
			expect(response.status).toBe(200);

			const body = await response.json();
			expect(body).toEqual([]);
		})

		it('should return 500 if getURLSOwnedBy throws', async () => {
			const mockURLRepository = new MockURLRepository();
			const mockAuthProvider = new MockAuthProvider();

			mockURLRepository.getURLSOwnedBy.mockRejectedValue(new Error('Fake error in getURLSOwnedBy()'));

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_GET({ urlRepository: mockURLRepository, auth: mockAuthProvider }, {} as any);
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
		};

		beforeEach(() => {
			mockURLRepository = new MockURLRepository();
			mockAuthProvider = new MockAuthProvider();
			mockBody = { id: 'short', redirectUrl: 'redirect', owner: "00000000-0000-0000-0000-000000000000" };

			mockDeps = { urlRepository: mockURLRepository, auth: mockAuthProvider, body: mockBody };
		});

		it('should return 401 if not authenticated', async () => {
			mockURLRepository.getURLFromShortPath.mockResolvedValue(null);
			mockAuthProvider.isAuthenticated.mockReturnValue(false);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_POST(mockDeps, {} as any);
			expect(response.status).toBe(401);

			const body = await response.json();
			expect(body).toEqual({ error: 'Unauthorized' });
		});

		it('should return 500 if insertURL throws', async () => {
			mockURLRepository.getURLFromShortPath.mockResolvedValue(null);
			mockURLRepository.insertURL.mockRejectedValue(new Error('Fake error in insertURL()'));
			mockAuthProvider.isAuthenticated.mockReturnValue(true);

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const response = await endpoint_POST(mockDeps, {} as any);

			expect(response.status).toBe(500);

			const body = await response.json();
			expect(body).toEqual({ error: 'An error occurred' });
		});

		it('should return 201 if successful', async () => {
			mockURLRepository.getURLFromShortPath.mockResolvedValue(null);
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
