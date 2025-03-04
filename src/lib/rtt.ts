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

export async function fetchClasses(
	uid: string,
	date: string,
): Promise<number[] | null> {
	try {
		const lookup = `${uid}:${date}`;

		// const saved = await db
		// 	.select()
		// 	.from(ClassCache)
		// 	.where(eq(ClassCache.lookup, lookup));

		// if (saved.length) {
		// 	return saved.map((record) => record.class_number);
		// }

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
			await db.insert(ClassCache).values(
				Array.from(classes).map((class_number) => ({
					class_number,
					lookup,
				})),
			);
		}

		return Array.from(classes);
	} catch (error) {
		console.error('failed to fetch classes', uid, date, error);
		return null;
	}
}
