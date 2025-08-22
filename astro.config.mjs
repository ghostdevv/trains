import { defineConfig, envField } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	integrations: [svelte()],
	adapter: cloudflare({ platformProxy: { enabled: true } }),
	output: 'server',
	trailingSlash: 'never',
	env: {
		validateSecrets: true,
		schema: {
			RTT_AUTH: envField.string({ context: 'server', access: 'secret' }),
		},
	},
});
