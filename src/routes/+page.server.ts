import { db } from '$lib/server/db';

export async function load() {
	const budgets = await db.query.budget.findMany();
	const members = await db.query.member.findMany();
	const purchases = await db.query.purchase.findMany();
	const teams = await db.query.team.findMany();

	return {
		budgets,
		members,
		purchases,
		teams
	};
}
