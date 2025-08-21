import { fzf } from '$lib/fuzzy-search';
import stations from './stations.json';

export interface StationData {
	name: string;
	crs: string;
	tiploc?: string;
}

export function findStation(query: string): StationData | null {
	// biome-ignore lint/style/noParameterAssign: it's ok
	query = query.trim().toLowerCase();

	const station =
		stations.find((s) => s.crs == query) ||
		stations.find((s) => s.tiploc == query) ||
		stations.find((s) => fzf(query, s.name));

	return station || null;
}

export function findByCRS(crs: string): StationData | null {
	if (crs.length !== 3) {
		return null;
	}

	const station = stations.find((s) => s.crs == crs);
	return station || null;
}
