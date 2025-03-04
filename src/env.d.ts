/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		runtime: {
			env: {
				CACHE: import('@cloudflare/workers-types').KVNamespace;
			};
		};
	}
}
