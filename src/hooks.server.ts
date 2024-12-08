import { CLERK_SECRET_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'clerk-sveltekit/server';

const protectedPaths = ['/'];

export const handle = sequence(
	withClerkHandler({
		signInUrl: '/login',
		afterSignInUrl: '/',
		secretKey: CLERK_SECRET_KEY
	}),
	({ event, resolve }) => {
		const { userId } = event.locals.auth;

		if (!userId && protectedPaths.includes(event.url.pathname)) {
			return redirect(307, '/login');
		}

		return resolve(event);
	}
);
