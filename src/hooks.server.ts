import { CLERK_SECRET_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { withClerkHandler } from 'clerk-sveltekit/server';

export const handle = sequence(
	withClerkHandler({
		signInUrl: '/login',
		afterSignInUrl: '/',
		secretKey: CLERK_SECRET_KEY
	}),
	({ event, resolve }) => {
		const { userId } = event.locals.auth;

		if (!userId && !event.url.pathname.startsWith('/login')) {
			return redirect(307, '/login');
		}

		return resolve(event);
	}
);
