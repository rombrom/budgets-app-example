import { db } from './index';
import * as table from './schema';
import { eq } from 'drizzle-orm';

export async function getBudgets() {
	const budgets = await db
		.select()
		.from(table.budgetView)
		.leftJoin(table.team, eq(table.team.id, table.budgetView.teamId));

	return budgets.map((_) => Object.assign({}, _.budget_spend, { team: _.team }));
}
