import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	wiki: defineCollection({
		loader: glob({
			base: './src/content/wiki',
			pattern: '**/*.md',
			generateId(options) {
				return `/${options.entry}`
					.replace(/\.md$/, '')
					.replace(/(?<=\/)index$/, '');
			},
		}),
		schema: () =>
			z.object({
				title: z.string(),
				description: z.string(),
			}),
	}),
};
