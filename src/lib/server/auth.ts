import type { IAuthProvider } from '$lib/server/types/auth';
import type { AuthObject } from '@clerk/backend';

export class ClerkAuthProvider implements IAuthProvider {
	constructor(private auth: AuthObject) {}

	isAuthenticated() {
		return !!this.auth.userId;
	}
}
