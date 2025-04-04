import { pgTable, serial, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';

const genericFields = {
	id: serial('id').primaryKey(),
	createdAt: timestamp().defaultNow(),
	updatedAt: timestamp()
		.defaultNow()
		.$onUpdate(() => new Date())
};

export const team = pgTable('team', {
	...genericFields,
	email: text().notNull(),
	name: text()
});

export const member = pgTable('member', {
	...genericFields,
	name: text().notNull(),
	teamId: integer().references(() => team.id),
	userId: uuid().references(() => authUsers.id, { onDelete: 'cascade' })
});

export const budget = pgTable('budget', {
	...genericFields,
	amount: integer().notNull(),
	name: text().notNull(),
	teamId: integer().references(() => team.id),
	validFrom: timestamp().notNull(),
	validUntil: timestamp().notNull()
});

export const purchase = pgTable('purchase', {
	...genericFields,
	amount: integer().notNull(),
	budgetId: integer().references(() => budget.id),
	teamId: integer().references(() => team.id)
});
