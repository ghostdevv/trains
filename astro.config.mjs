import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
	integrations: [svelte(), db()],
	adapter: cloudflare(),
	output: 'server',
	vite: {
		define: {
			'import.meta.env.RTT_AUTH': JSON.stringify(process.env.RTT_AUTH),
		},
	},
});
