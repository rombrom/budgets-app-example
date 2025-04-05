<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';

	let {
		action,
		id,
		team,
		teams
	}: {
		action: string;
		id: number;
		team?: { id: number; name: string | null };
		teams: { id: number; name: string | null }[];
	} = $props();

	let value = $state(String(team?.id));
	let ref = $state<HTMLFormElement | null>(null);
</script>

<form bind:this={ref} method="POST" {action}>
	<input type="hidden" name="id" value={id} />
	<Select.Root
		type="single"
		bind:value
		name="teamId"
		onValueChange={(nextValue) => {
			value = nextValue;
			setTimeout(() => ref?.submit());
		}}
	>
		<Select.Trigger class="whitespace-nowrap">
			{team?.name ?? team?.id ?? 'Select a team'}
		</Select.Trigger>
		<Select.Content>
			{#each teams as team (team.id)}
				<Select.Item value={String(team.id)} label={team.name ?? String(team.id)} />
			{/each}
		</Select.Content>
	</Select.Root>
</form>
