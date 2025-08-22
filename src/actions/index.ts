import { searchWikipediaTrains } from '$lib/data/wikipedia';
import type { StationData } from '$lib/data/stations';
import Fuse, { type FuseResult } from 'fuse.js';
import stations from '$lib/data/stations.json';
import { defineAction } from 'astro:actions';
import { cached } from '$lib/data/cached';
import { sha256 } from '$lib/utils/hash';
import { z } from 'astro:schema';

interface Result {
	query: string;
	matches: StationData | FuseResult<StationData>[];
}

export const server = {
	stationSearch: defineAction({
		accept: 'form',
		input: z.object({
			query: z.string().min(1).max(128).trim().toLowerCase(),
		}),
		async handler({ query }): Promise<Result> {
			const codeMatch = stations.find(
				(s) => s.crs === query || s.tiploc === query,
			);

			if (codeMatch) {
				return { query, matches: codeMatch as StationData };
			}

			const fuse = new Fuse<StationData>(stations, {
				keys: [
					{ name: 'name', weight: 3 },
					{ name: 'crs', weight: 2 },
					{ name: 'tiploc', weight: 1 },
				],
			});

			return { query, matches: fuse.search(query, { limit: 8 }) };
		},
	}),
	trainSearch: defineAction({
		accept: 'form',
		input: z.object({
			query: z.string().min(1).max(128).trim().toLowerCase(),
		}),
		async handler({ query }, ctx) {
			const queryHash = await sha256(query);
			const result = await cached(
				ctx.locals.runtime.env.CACHE,
				`train-lookup:${queryHash}`,
				async () => await searchWikipediaTrains(query),
			);

			return {
				query,
				result,
			};
		},
	}),
};
