import { findStation } from '$lib/data/stations';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, redirect }) => {
	const query = url.searchParams.get('q');
	if (!query) return redirect('/');

	const station = findStation(query);

	return redirect(
		station
			? `/tools/station-lookup/${station.crs}`
			: '/tools/station-lookup?error=search-missing-station',
	);
};
