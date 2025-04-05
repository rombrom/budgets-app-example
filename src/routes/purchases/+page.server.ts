import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { eq, getTableColumns, sql } from 'drizzle-orm';

const schema = valibot(formSchema);

export const actions = {
	async create({ request }) {
		const form = await superValidate(request, schema);

		if (!form.valid) return fail(400, { form });

		const amount = Number(form.data.amount) * 100;
		const budgetId = Number(form.data.budgetId);

		const [result] = await db.transaction(async (tx) => {
			const [budget] = await tx
				.select({
					...getTableColumns(table.budget),
					remaining: sql<number>`(${table.budget.amount} - sum(${table.purchase.amount}))::int`
				})
				.from(table.budget)
				.where(eq(table.budget.id, budgetId))
				.leftJoin(table.purchase, eq(table.budget.id, table.purchase.budgetId))
				.groupBy(table.budget.id);

			if (budget.remaining - amount < 0) tx.rollback();

			return tx
				.insert(table.purchase)
				.values({ amount, budgetId, memberId: Number(form.data.memberId) })
				.returning();
		});

		return { form, result };
	}
};

export async function load() {
	const [budgets, members, purchases, form] = await Promise.all([
		db.query.budget.findMany(),
		db.query.member.findMany(),
		db.query.purchase.findMany({
			with: { budget: true, member: true }
		}),
		superValidate(schema)
	]);

	console.log(
		await db
			.select({
				...getTableColumns(table.budget),
				spent: sql<number>`sum(${table.purchase.amount})::int`,
				remaining: sql<number>`(${table.budget.amount} - sum(${table.purchase.amount}))::int`
			})
			.from(table.budget)
			.leftJoin(table.purchase, eq(table.budget.id, table.purchase.budgetId))
			.groupBy(table.budget.id)
	);

	return { budgets, form, members, purchases };
}
