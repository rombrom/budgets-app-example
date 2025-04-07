import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { valibot } from 'sveltekit-superforms/adapters';

const schema = valibot(formSchema);

export const actions = {
	async create({ request }) {
		const form = await superValidate(request, schema);

		if (!form.valid) return fail(400, { form });

		const result = await db.insert(table.team).values({ name: form.data.name }).returning();

		return { form, result };
	}
};

export async function load() {
	const [teams, form] = await Promise.all([
		db.query.team.findMany({
			with: {
				budgets: true,
				members: true
			}
		}),
		superValidate(schema)
	]);

	return { form, teams };
}
