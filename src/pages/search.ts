import stations from '$lib/data/stations.json';
import { ErrorMessage } from '$lib/errors';
import { fzf } from '$lib/fuzzy-search';
import type { APIRoute } from 'astro';

function findCRS(query: string): string | null {
	query = query.toLowerCase();

	const result = stations.find(
		(s) => [s.crs, s.tiploc].includes(query) || fzf(query, s.name),
	);

	return result?.crs || null;
}

export const GET: APIRoute = ({ url, redirect }) => {
	const query = url.searchParams.get('q');
	if (!query) return redirect('/');

	const crs = findCRS(query);
	return redirect(crs ? `/${crs}` : '/?error=search-missing-station');
};
