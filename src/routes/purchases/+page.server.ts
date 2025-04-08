import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { eq, getTableColumns, sql } from 'drizzle-orm';
import { getBudgets } from '$lib/server/db/util';
import { setFlash } from 'sveltekit-flash-message/server';

const schema = valibot(formSchema);

export const actions = {
	async create({ cookies, request }) {
		const form = await superValidate(request, schema);

		if (!form.valid) return fail(400, { form });

		const amount = Number(form.data.amount) * 100;
		const budgetId = Number(form.data.budgetId);

		const [budget] = await db
			.select({
				...getTableColumns(table.budget),
				remaining: sql<number>`(${table.budget.amount} - sum(${table.purchase.amount}))::int`
			})
			.from(table.budget)
			.where(eq(table.budget.id, budgetId))
			.leftJoin(table.purchase, eq(table.budget.id, table.purchase.budgetId))
			.groupBy(table.budget.id);

		const now = new Date().getTime();
		const available = budget.remaining ?? budget.amount;
		const withinTimeframe = now >= budget.validFrom.getTime() && now <= budget.validUntil.getTime();

		if (!withinTimeframe) {
			setFlash(
				{ type: 'error', message: 'Cannot make purchase outside of budget timeframe.' },
				cookies
			);
			return fail(400, { form });
		}
		if (available - amount < 0) {
			setFlash({ type: 'error', message: 'Not enough budget remaining.' }, cookies);
			return fail(400, { form });
		}

		const result = await db
			.insert(table.purchase)
			.values({ amount, budgetId, memberId: Number(form.data.memberId) })
			.returning();

		return { form, result };
	}
};

export async function load() {
	const [budgets, members, purchases, form] = await Promise.all([
		getBudgets(),
		db.query.member.findMany(),
		db.query.purchase.findMany({
			with: { budget: true, member: true }
		}),
		superValidate(schema)
	]);

	return { budgets, form, members, purchases };
}
