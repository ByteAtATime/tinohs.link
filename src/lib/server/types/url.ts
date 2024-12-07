import type { SelectUrlSchema } from '$lib/server/url';

export interface IURLRepository {
	getURLFromShortPath: (shortPath: string) => Promise<string | null>;
	getAllURLs: () => Promise<SelectUrlSchema[]>;
	getURLSOwnedBy: (owner: string) => Promise<SelectUrlSchema[]>;

	/** @returns The ID of the inserted URL */
	insertURL: (redirectUrl: string, shortPath: string, creator: string, name?: string) => Promise<string>;
}
