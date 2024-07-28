import { ofetch } from 'ofetch';

const $fetch = ofetch.create({
	baseURL: 'https://api.rtt.io/api/v1/json',
	headers: {
		Authorization: import.meta.env.RTT_AUTH,
	},
});

export async function rtt<T>(path: string) {
	return $fetch<T>(path).catch((error) => {
		console.error('rtt auth', import.meta.env.RTT_AUTH);
		console.error('rtt fetch error', error);
		return null;
	});
}
