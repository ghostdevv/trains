import cloudflare from '@astrojs/cloudflare';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	integrations: [svelte()],
	adapter: cloudflare(),
	output: 'server',
});
