<script lang="ts">
	import { enhance } from '$app/forms';
	import * as Select from '$lib/components/ui/select/index.js';
	import type * as table from '$lib/server/db/schema';
	import { toast } from 'svelte-sonner';

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

<form
	bind:this={ref}
	method="POST"
	{action}
	use:enhance={async () => {
		return async function ({ update, result }) {
			await update();
			if (result?.type === 'success') toast.success('Updated team.');
		};
	}}
>
	<input type="hidden" name="memberId" value={String(member.id)} />
	<Select.Root type="single" {value} name="teamId">
		<Select.Trigger class="whitespace-nowrap">
			{member?.team?.name ?? member?.team?.id ?? 'Select a team'}
		</Select.Trigger>
		<Select.Content>
			<Select.Item onclick={() => ref?.requestSubmit()} value="" label="No team" />
			{#each teams as team (team.id)}
				<Select.Item
					onclick={() => ref?.requestSubmit()}
					value={String(team.id)}
					label={team.name ?? String(team.id)}
				/>
			{/each}
		</Select.Content>
	</Select.Root>
</form>
