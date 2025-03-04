import type { KVNamespace } from '@cloudflare/workers-types';
import { RTT_AUTH } from 'astro:env/server';
import { ofetch } from 'ofetch';

const $fetch = ofetch.create({
	baseURL: 'https://api.rtt.io/api/v1/json',
	headers: {
		Authorization: RTT_AUTH,
	},
});

export async function rtt<T>(path: string) {
	return $fetch<T>(path).catch((error) => {
		console.error('rtt auth', import.meta.env.SSR, RTT_AUTH);
		console.error('rtt fetch error', error);
		return null;
	});
}

interface CacheResult {
	classNumber: number;
}

async function checkCache(CACHE: KVNamespace, prefix: string) {
	const keys: string[] = [];
	let cursor: string = '';

	while (true) {
		const results = await CACHE.list({
			prefix,
			cursor,
		});

		keys.push(...results.keys.map((key) => key.name));

		if (results.list_complete) {
			break;
		}

		cursor = results.cursor;
	}

	const results: CacheResult[] = [];

	for (const key of keys) {
		const result = await CACHE.get<CacheResult>(key, 'json');

		if (result) {
			results.push(result);
		}
	}

	return results;
}

export async function fetchClasses(
	uid: string,
	date: string,
	CACHE: KVNamespace,
): Promise<number[] | null> {
	try {
		const lookupPrefix = `${uid}-${date}`;
		const saved = await checkCache(CACHE, lookupPrefix);

		if (saved.length) {
			return saved.map((result) => result.classNumber);
		}

		const data = await ofetch(
			`https://www.realtimetrains.co.uk/service/gb-nr:${uid}/${date}/detailed`,
			{ responseType: 'text' },
		);

		const matches = data.matchAll(/<span class="identity">(\d+)<\/span>/g);

		const classes = new Set<number>();

		for (const match of matches) {
			const classNumber = parseInt(`${match[1]}`);

			if (typeof classNumber == 'number' && !Number.isNaN(classNumber)) {
				classes.add(classNumber);
			}
		}

		if (classes.size > 0) {
			for (const classNumber of classes) {
				await CACHE.put(
					`${lookupPrefix}:${classNumber}`,
					JSON.stringify({ classNumber } satisfies CacheResult),
					{ expirationTtl: 604800 },
				);
			}
		}

		return Array.from(classes);
	} catch (error) {
		console.error('failed to fetch classes', uid, date, error);
		return null;
	}
}
