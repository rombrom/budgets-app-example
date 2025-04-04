import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error: signUpError } = await supabase.auth.signUp({ email, password });

		if (signUpError) {
			console.error(signUpError);
			return fail(400, { error: signUpError.message });
		}

		const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

		if (signInError) {
			console.error(signInError);
			return fail(400, { error: signInError.message });
		}

		redirect(303, '/');
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

		if (signInError) {
			console.error(signInError);
			return fail(400, { error: signInError.message });
		}

		redirect(303, '/');
	}
};
