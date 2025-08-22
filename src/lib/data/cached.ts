export async function cached<T>(
	CACHE: KVNamespace,
	key: string,
	fn: () => Promise<T>,
	ttl = 60 * 60 * 24 * 7,
): Promise<T> {
	// await CACHE.delete(key);
	const hit = await CACHE.get<T>(key, 'json');
	if (hit) return hit;

	const value = await fn();
	await CACHE.put(key, JSON.stringify(value), { expirationTtl: ttl });

	return value;
}
