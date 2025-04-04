import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';

export const actions = {
	async create({ request }) {
		const formData = await request.formData();
		const name = formData.get('name');

		if (!name || typeof name !== 'string') return fail(400);

		const result = await db.insert(schema.team).values({ name }).returning();

		return { result };
	}
};

export async function load() {
	const teams = await db.query.team.findMany({
		with: {
			budgets: true,
			members: true
		}
	});

	return { teams };
}
