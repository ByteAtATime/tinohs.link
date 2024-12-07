import type { IURLRepository } from '$lib/server/types/url';
import type { SelectUrlSchema } from '$lib/server/url';
import { vi } from 'vitest';

export class MockURLRepository implements IURLRepository {
	public static MOCK_URL = {
		id: 'short',
		owner: '00000000-0000-0000-0000-000000000000',
		redirectUrl: 'redirect',
		name: null,
		createdAt: new Date(),
		updatedAt: new Date()
	} satisfies SelectUrlSchema;

	getAllURLs = vi.fn().mockResolvedValue([MockURLRepository.MOCK_URL]);

	insertURL = vi.fn().mockResolvedValue(MockURLRepository.MOCK_URL.id);

	getURLFromShortPath = vi.fn().mockImplementation((shortPath: string) => {
		if (shortPath === MockURLRepository.MOCK_URL.id) {
			return MockURLRepository.MOCK_URL;
		}
		return null;
	});

	getURLSOwnedBy = vi.fn().mockImplementation((owner: string) => {
		if (owner === MockURLRepository.MOCK_URL.owner) {
			return [MockURLRepository.MOCK_URL];
		}
		return [];
	});
}
