import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const data = await request.formData();

		const res = await fetch('/api/urls', {
			method: 'POST',
			body: JSON.stringify({
				id: data.get('short_url'),
				redirectUrl: data.get('redirect_url')
			})
		});

		return {
			status: res.status,
			body: await res.json()
		};
	}
};
