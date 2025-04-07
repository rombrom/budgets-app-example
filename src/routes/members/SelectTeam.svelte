<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import type * as table from '$lib/server/db/schema';

	let {
		action,
		member,
		teams
	}: {
		action: string;
		member: typeof table.member.$inferSelect & { team: typeof table.team.$inferSelect | null };
		teams: { id: number; name: string | null }[];
	} = $props();

	let value = $state(String(member.teamId));
	let ref = $state<HTMLFormElement | null>(null);
</script>

<form bind:this={ref} method="POST" {action}>
	<input type="hidden" name="memberId" value={String(member.id)} />
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
			{member?.team?.name ?? member?.team?.id ?? 'Select a team'}
		</Select.Trigger>
		<Select.Content>
			{#each teams as team (team.id)}
				<Select.Item value={String(team.id)} label={team.name ?? String(team.id)} />
			{/each}
		</Select.Content>
	</Select.Root>
</form>
