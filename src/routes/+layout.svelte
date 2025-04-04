<script>
	import '../app.css';

	import { invalidate } from '$app/navigation';
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

<nav>
  <a href="/">Home</a>
  <a href="/budgets">Budgets</a>
  <a href="/members">Members</a>
  <a href="/purchases">Purchases</a>
  <a href="/teams">Teams</a>
</nav>

{#if data?.user}
	<p>Hi, {data.user.email}!</p>
	<p><button onclick={logout} type="button">Logout</button></p>
{/if}

{@render children()}
