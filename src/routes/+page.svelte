<script lang="ts">
	let { data } = $props();
	console.log({ data });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<pre>
  Budgets:
  {JSON.stringify(data.budgets, null, 2)}
</pre>

<pre>
  Members:
  {JSON.stringify(data.members, null, 2)}
</pre>

<pre>
  Purchases:
  {JSON.stringify(data.purchases, null, 2)}
</pre>

<pre>
  Teams:
  {JSON.stringify(data.teams, null, 2)}
</pre>
