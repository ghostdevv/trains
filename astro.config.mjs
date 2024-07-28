import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import { loadEnv } from 'vite';
import db from '@astrojs/db';

const { RTT_AUTH } = loadEnv(process.env.NODE_ENV, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
	integrations: [svelte(), db()],
	adapter: cloudflare(),
	output: 'server',
	vite: {
		define: {
			__TEST__: `"${RTT_AUTH}"`,
		},
	},
});
