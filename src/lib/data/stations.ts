import stations from './stations.json';

export interface StationData {
	name: string;
	crs: string;
	tiploc?: string;
}

export function getStation(crs: string): StationData | null {
	if (crs.length !== 3) {
		return null;
	}

	const station = stations.find((s) => s.crs == crs);
	return station || null;
}
