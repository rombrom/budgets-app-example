<script>
	import '../app.css';

	import { invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	console.log({ data });

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) console.error(error);
	}

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Toaster />

<nav class="container flex flex-wrap items-center justify-center gap-4 border-b py-4 font-bold">
	<a class="mx-auto text-primary underline sm:ml-0" href="/">Budgy.app</a>
	<a class="underline" href="/budgets">Budgets</a>
	<a class="underline" href="/members">Members</a>
	<a class="underline" href="/purchases">Purchases</a>
	<a class="mr-auto underline" href="/teams">Teams</a>
</nav>

<main class="container flex-1">
	{#if data?.user}
		<p>Hi, {data.user.email}!</p>
		<p><button onclick={logout} type="button">Logout</button></p>
	{/if}

	{@render children()}
</main>

<footer class="container mt-8 flex flex-wrap items-center justify-center border-t py-4">
	<em>The flexible way to budget.</em>
</footer>
