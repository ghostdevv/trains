import { defineDb, defineTable, column } from 'astro:db';

const ClassCache = defineTable({
	columns: {
		id: column.number({ primaryKey: true }),
		lookup: column.text(),
		class_number: column.number(),
	},
	indexes: [{ on: ['lookup', 'class_number'], unique: true }],
});

// https://astro.build/db/config
export default defineDb({
	tables: {
		ClassCache,
	},
});
