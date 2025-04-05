import * as v from 'valibot';

const decimals = 100;

export const formSchema = v.object({
	amount: v.pipe(
		v.string(),
		v.transform((value) => Number(value) * decimals),
		v.minValue(1),
		v.integer(),
		v.transform((value) => String(value / decimals))
	),
	budgetId: v.pipe(v.string()),
	memberId: v.pipe(v.string())
});
