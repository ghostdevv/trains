export const ERRORS = Object.freeze({
	'search-missing-station':
		'Unable to find a station matching that search query',
	'rtt-station-not-found': 'No station matching this CRS was found on RTT',
	unhandled: 'Unhandled error',
});

export function getErrorMessage(key: any) {
	return key in ERRORS ? ERRORS[key as keyof typeof ERRORS] : null;
}
