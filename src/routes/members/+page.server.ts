import { db } from '$lib/server/db';

export async function load() {
	const members = await db.query.member.findMany();
	return { members };
}
