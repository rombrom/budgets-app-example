import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import type { PgTableWithColumns, PgColumn } from 'drizzle-orm/pg-core';

const schema = valibot(formSchema);

export const actions = {
	async create({ request }) {
		const form = await superValidate(request, schema);

		if (!form.valid) return fail(400, { form });

		const result = await db
			.insert(table.budget)
			.values({
				amount: Number(form.data.amount) * 100,
				name: form.data.name,
				teamId: Number(form.data.teamId),
				validFrom: form.data.validFrom,
				validUntil: form.data.validUntil
			})
			.returning();

		return { form, result };
	}
};

export async function load() {
	const [budgets, teams, form] = await Promise.all([
		db.query.budget.findMany({
			with: { purchases: true, team: true }
		}),
		db.query.team.findMany(),
		superValidate(schema)
	]);

	console.log(
		await db
			.select({
				...getTableColumns(table.budget),
				spent: sql<number>`sum(${table.purchase.amount})`,
				remaining: sql<number>`${table.budget.amount} - sum(${table.purchase.amount})`
			})
			.from(table.budget)
			.leftJoin(table.purchase, eq(table.budget.id, table.purchase.budgetId))
			.groupBy(table.budget.id)
	);

	return { budgets, form, teams };
}
