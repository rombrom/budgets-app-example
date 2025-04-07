import * as v from 'valibot';

export const formSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1))
});
