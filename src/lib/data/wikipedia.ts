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

type MissingWikipediaPage = {
	missing: true;
};

type WikipediaPage = {
	pageid: number;
	title: string;
	extract: string;
	pageimage: string;
};

interface WikipediaResponse {
	query: {
		pages: (WikipediaPage | MissingWikipediaPage)[];
	};
}

export async function fetchWikipediaTrainInfo(
	classNumber: string,
	locals: App.Locals,
) {
	const data = await ofetch<WikipediaResponse>(constructURL(classNumber), {
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
