import { findStation } from '$lib/data/stations';
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
	stationSearch: defineAction({
		accept: 'form',
		input: z.object({
			// tool: z.union([z.literal('live-trains'), z.literal('station-lookup')]),
			query: z.string().min(1).max(128).trim().toLowerCase(),
		}),
		async handler({ query }) {
			return findStation(query);
		},
	}),
};
