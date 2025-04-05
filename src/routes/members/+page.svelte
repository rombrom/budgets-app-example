<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';

	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import { type ColumnDef } from '@tanstack/table-core';

	import SelectTeam from './SelectTeam.svelte';

	let { data } = $props();

	const columns: ColumnDef<(typeof data.members)[number]>[] = [
		{ accessorKey: 'id' },
		{ accessorKey: 'email' },
		{ accessorKey: 'name' },
		{
			accessorKey: 'teamId',
			cell: ({ row }) =>
				renderComponent(SelectTeam, {
					action: '?/updateTeam',
					id: row.original.id,
					teams: data.teams,
					team: data.teams.find(({ id }) => id === row.original.teamId)
				})
		},
		{ accessorKey: 'userId' },
		{ accessorKey: 'createdAt' },
		{ accessorKey: 'updatedAt' }
	];
</script>

Members

<DataTable {columns} data={data.members} />
