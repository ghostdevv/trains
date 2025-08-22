import { USER_AGENT } from '$lib/utils/user-agent';
import { ofetch } from 'ofetch';

function constructURL(classNumber: string) {
	const url = new URL('https://en.wikipedia.org/w/api.php');
	url.searchParams.append('action', 'query');
	url.searchParams.append('prop', 'extracts|pageimages');
	url.searchParams.append('explaintext', '1');
	url.searchParams.append('titles', `British_Rail_Class_${classNumber}`);
	url.searchParams.append('format', 'json');
	url.searchParams.append('formatversion', '2');
	return url.toString();
}

type MissingTrainPage = {
	missing: true;
};

type TrainPage = {
	pageid: number;
	title: string;
	extract: string;
	pageimage: string;
};

type TrainPageResponse = {
	query: {
		pages: (TrainPage | MissingTrainPage)[];
	};
};

export async function fetchWikipediaTrainInfo(
	classNumber: string,
	locals: App.Locals,
) {
	const data = await ofetch<TrainPageResponse>(constructURL(classNumber), {
		headers: {
			'User-Agent': USER_AGENT,
		},
	});

	// We'll just assume there's only one page
	const [page] = data.query.pages;

	if ('missing' in page) {
		return null;
	}

	const summaryResponse = await locals.runtime.env.AI.run(
		'@cf/facebook/bart-large-cnn',
		{ input_text: page.extract },
		{ gateway: { id: 'trains-app' } },
	);

	return {
		link: `https://en.wikipedia.org/?curid=${page.pageid}`,
		summary: summaryResponse.summary,
		image: `https://commons.wikimedia.org/wiki/Special:FilePath/${page.pageimage}`,
	};
}

type TrainPageSearchResult = {
	title: string;
};

type TrainPageSearchResponse = {
	query: {
		search: TrainPageSearchResult[];
	};
};

export async function searchWikipediaTrains(query: string, locals: App.Locals) {
	if (query.length <= 3 && Number.parseInt(query, 10)) {
		const data = await fetchWikipediaTrainInfo(query, locals);
		if (data) {
			return [{ classNumber: Number.parseInt(query, 10) }];
		}
	}

	const url = new URL('https://en.wikipedia.org/w/api.php');
	url.searchParams.append('action', 'query');
	url.searchParams.append('format', 'json');
	url.searchParams.append('formatversion', '2');
	url.searchParams.append('list', 'search');
	url.searchParams.append(
		'srsearch',
		`intitle:"British Rail Class" ${query}`,
	);

	const data = await ofetch<TrainPageSearchResponse>(url.toString(), {
		headers: {
			'User-Agent': USER_AGENT,
		},
	});

	// todo show a description of the train in search ui
	return data.query.search
		.map((page) => ({
			classNumber: Number.parseInt(
				page.title.replace('British Rail Class', '').trim(),
				10,
			),
		}))
		.filter((result) => !Number.isNaN(result.classNumber));
}
