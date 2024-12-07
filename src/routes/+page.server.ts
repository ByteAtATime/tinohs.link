import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { selectUrlSchema } from '$lib/server/url';

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const data = await request.formData();

		const res = await fetch('/api/urls', {
			method: 'POST',
			body: JSON.stringify({
				id: data.get('short_url'),
				redirectUrl: data.get('redirect_url'),
				name: data.get('name')
			})
		});

		if (!res.ok) {
			const data = await res.json();
			return fail(res.status, { error: data.error })
		}

		return {
			status: res.status,
			body: await res.json()
		};
	}
};

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/urls');
	const rawData = await res.json();

	if (res.status !== 200) {
		return fail(res.status, { error: rawData.error });
	}

	const data = selectUrlSchema.array().parse(rawData);

	return {
		urls: data
	};
}
