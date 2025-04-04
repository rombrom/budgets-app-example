<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	console.log({ data, form });
</script>

<form method="POST" action="?/login">
	{#if form?.error}
		<p class="text-red-400">{form.error}</p>
	{/if}

	<label>
		Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Login</button>
	<button formaction="?/signup">Sign up</button>
</form>
