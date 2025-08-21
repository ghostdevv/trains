export const ERRORS = Object.freeze({
	'search-missing-station': 'Unable to find a station matching that search query',
	'rtt-station-not-found': 'No station matching this CRS was found on RTT',
	unhandled: 'Unhandled error',
});

type ErrorKey = keyof typeof ERRORS;

function isErrorKey(key: unknown): key is ErrorKey {
	return (
		typeof key === 'string' &&
		key in ERRORS &&
		typeof ERRORS[key as ErrorKey] === 'string'
	);
}

export function getErrorMessage(key: (string & {}) | ErrorKey) {
	return isErrorKey(key) ? ERRORS[key] : null;
}
