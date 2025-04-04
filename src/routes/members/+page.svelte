<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';

	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import { type ColumnDef } from '@tanstack/table-core';

	import DeleteMember from './DeleteMember.svelte';

	let { data } = $props();

	const columns: ColumnDef<(typeof data.members)[number]>[] = [
		{ accessorKey: 'id' },
		{ accessorKey: 'email' },
		{ accessorKey: 'name' },
		{ accessorKey: 'teamId' },
		{ accessorKey: 'userId' },
		{ accessorKey: 'createdAt' },
		{ accessorKey: 'updatedAt' },
		{
			id: 'delete',
			cell: ({ row }) =>
				renderComponent(DeleteMember, {
					action: '?/delete',
					email: row.original.email,
					id: row.original.id
				})
		}
	];
</script>

Members

<DataTable {columns} data={data.members} />
