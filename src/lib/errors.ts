export const ERRORS = Object.freeze({
	'search-missing-station':
		'Unable to find a station matching that search query',
});

export function getErrorMessage(key: any) {
	return key in ERRORS ? ERRORS[key as keyof typeof ERRORS] : null;
}
