import {
	pgMaterializedView,
	pgTable,
	serial,
	text,
	integer,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';
import { getTableColumns, relations, sql, eq } from 'drizzle-orm';
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
	name: text()
});

export const member = pgTable('member', {
	...genericFields,
	email: text().notNull(),
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
	memberId: integer().references(() => member.id)
});

export const budgetView = pgMaterializedView('budget_spend').as((q) =>
	q
		.select({
			...getTableColumns(budget),
			spent: sql<number>`sum(${purchase.amount})::int`.as('spent'),
			remaining: sql<number>`(${budget.amount} - sum(${purchase.amount}))::int`.as('remaining')
		})
		.from(budget)
		.leftJoin(purchase, eq(budget.id, purchase.budgetId))
		.groupBy(budget.id)
);

export const teamRelations = relations(team, ({ many }) => ({
	budgets: many(budget),
	members: many(member)
}));

export const memberRelations = relations(member, ({ many, one }) => ({
	purchases: many(purchase),
	team: one(team, {
		fields: [member.teamId],
		references: [team.id]
	})
}));

export const budgetRelations = relations(budget, ({ many, one }) => ({
	purchases: many(purchase),
	team: one(team, {
		fields: [budget.teamId],
		references: [team.id]
	})
}));

export const purchaseRelations = relations(purchase, ({ one }) => ({
	budget: one(budget, {
		fields: [purchase.budgetId],
		references: [budget.id]
	}),
	member: one(member, {
		fields: [purchase.memberId],
		references: [member.id]
	})
}));
