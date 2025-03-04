import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import { loadEnv } from 'vite';

const { RTT_AUTH } = loadEnv(process.env.NODE_ENV, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
	integrations: [svelte()],
	adapter: cloudflare({ platformProxy: { enabled: true } }),
	output: 'server',
	vite: {
		define: {
			__RTT_AUTH__: `"${RTT_AUTH}"`,
		},
	},
});
