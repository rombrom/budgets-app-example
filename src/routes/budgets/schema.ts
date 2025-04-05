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
	name: v.pipe(v.string(), v.minLength(1)),
	teamId: v.pipe(v.string()),
	validFrom: v.pipe(v.date()),
	validUntil: v.pipe(v.date())
});
