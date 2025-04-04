import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema.js';
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

		const result = await db
			.delete(schema.member)
			.where(eq(schema.member.id, member.id))
			.returning();

		return { result };
	}
};

export async function load() {
	const members = await db.query.member.findMany();
	return { members };
}
