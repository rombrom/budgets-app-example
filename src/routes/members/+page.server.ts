import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const actions = {
	async delete({ request }) {
		const formData = await request.formData();
		const memberId = formData.get('id');

		if (!memberId) return fail(400);

		const member = await db.query.member.findFirst({
			where: ({ id }, { eq }) => eq(id, Number(memberId))
		});

		if (!member) return fail(400);

		const result = await db.delete(table.member).where(eq(table.member.id, member.id)).returning();

		return { result };
	},

	async updateTeam({ request }) {
		const formData = await request.formData();
		const memberId = formData.get('id');
		const teamId = formData.get('teamId');

		if (!memberId) return fail(400);
		if (!teamId) return fail(400);

		console.log({ teamId, memberId });

		const member = await db.query.member.findFirst({
			where: ({ id }, { eq }) => eq(id, Number(memberId))
		});

		if (!member) return fail(400);

		const team = await db.query.team.findFirst({
			where: ({ id }, { eq }) => eq(id, Number(teamId))
		});

		if (!team) return fail(400);

		const result = await db
			.update(table.member)
			.set({ teamId: Number(team.id) })
			.where(eq(table.member.id, member.id))
			.returning();

		return { result };
	}
};

export async function load() {
	const [members, teams] = await Promise.all([
		db.query.member.findMany(),
		db.query.team.findMany()
	]);

	return { members, teams };
}
