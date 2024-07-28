import { db, eq, ClassCache } from 'astro:db';
import { ofetch } from 'ofetch';

declare global {
	const __RTT_AUTH__: string;
}

const $fetch = ofetch.create({
	baseURL: 'https://api.rtt.io/api/v1/json',
	headers: {
		Authorization: __RTT_AUTH__,
	},
});

export async function rtt<T>(path: string) {
	return $fetch<T>(path).catch((error) => {
		console.error('rtt auth', import.meta.env.SSR, __RTT_AUTH__);
		console.error('rtt fetch error', error);
		return null;
	});
}

export async function fetchClasses(rttLink: string): Promise<number[]> {
	const saved = await db
		.select()
		.from(ClassCache)
		.where(eq(ClassCache.rtt_url, rttLink));

	if (saved.length) {
		return saved.map((record) => record.class_number);
	}

	const data = await ofetch(rttLink, { responseType: 'text' });
	const matches = data.matchAll(/<span class="identity">(\d+)<\/span>/g);

	const classes = Array.from(matches)
		.flatMap(([, classNumber]) => classNumber && parseInt(classNumber))
		.filter(
			(classNumber): classNumber is number =>
				typeof classNumber == 'number' && !isNaN(classNumber),
		);

	await db.insert(ClassCache).values(
		classes.map((class_number) => ({
			rtt_url: rttLink,
			class_number,
		})),
	);

	return classes;
}
