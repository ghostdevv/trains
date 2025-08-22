import { USER_AGENT } from './utils/user-agent';
import { RTT_AUTH } from 'astro:env/server';
import { ofetch } from 'ofetch';

const $fetch = ofetch.create({
	baseURL: 'https://api.rtt.io/api/v1/json',
	headers: {
		Authorization: RTT_AUTH,
		'User-Agent': USER_AGENT,
	},
});

export async function rtt<T>(path: string) {
	return $fetch<T>(path).catch((error) => {
		console.error('rtt fetch error', error);
		return null;
	});
}

async function checkCache(CACHE: KVNamespace, prefix: string) {
	const classes = new Set<number>();
	let cursor = '';

	while (true) {
		const results = await CACHE.list({
			prefix,
			cursor,
		});

		for (const { name } of results.keys) {
			const numbered = Number.parseInt(name, 10);

			if (!Number.isNaN(numbered)) {
				classes.add(numbered);
			}
		}

		if (results.list_complete) {
			break;
		}

		cursor = results.cursor;
	}

	return Array.from(classes);
}

export async function fetchClasses(
	uid: string,
	date: string,
	CACHE: KVNamespace,
): Promise<number[] | null> {
	try {
		const lookupPrefix = `${uid}-${date}`;

		const saved = await checkCache(CACHE, lookupPrefix);
		if (saved.length) return saved;

		const data = await ofetch(
			`https://www.realtimetrains.co.uk/service/gb-nr:${uid}/${date}/detailed`,
			{ responseType: 'text' },
		);

		const matches = data.matchAll(/<span class="identity">(\d+)<\/span>/g);

		const classes = new Set<number>();

		for (const match of matches) {
			const classNumber = Number.parseInt(`${match[1]}`, 10);

			if (typeof classNumber == 'number' && !Number.isNaN(classNumber)) {
				classes.add(classNumber);
			}
		}

		if (classes.size > 0) {
			for (const classNumber of classes) {
				await CACHE.put(`${lookupPrefix}:${classNumber}`, '', {
					expirationTtl: 604800,
				});
			}
		}

		return Array.from(classes);
	} catch (error) {
		console.error('failed to fetch classes', uid, date, error);
		return null;
	}
}
