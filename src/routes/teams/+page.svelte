<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import { Button } from '$lib/components/ui/button';

	import { type ColumnDef } from '@tanstack/table-core';

	let { data } = $props();

	const columns: ColumnDef<(typeof data.teams)[number]>[] = [
		{ accessorKey: 'id' },
		{ accessorKey: 'name' },
		{ accessorKey: 'createdAt' },
		{ accessorKey: 'updatedAt' }
	];
</script>

Teams

<form method="POST" action="?/create">
	<label>
		Name
		<input name="name" type="text" />
	</label>

	<Button>Create</Button>
</form>

{#if data.teams.length}
	<DataTable {columns} data={data.teams} />
{:else}
	<p>No teams</p>
{/if}
