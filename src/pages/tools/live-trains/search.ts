import { findStation } from '$lib/data/stations';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect }) => {
	const query = url.searchParams.get('q');
	if (!query) return redirect('/');

	const station = findStation(query);

	return redirect(
		station
			? `/tools/live-trains/${station.crs}`
			: '/tools/live-trains?error=search-missing-station',
	);
};
