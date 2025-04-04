<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import {
		createSvelteTable,
		FlexRender,
		renderComponent
	} from '$lib/components/ui/data-table/index.js';
	import { getCoreRowModel, type ColumnDef } from '@tanstack/table-core';

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
			cell: ({ row }) => renderComponent(DeleteMember, { action: '?/delete', id: row.original.id })
		}
	];

	const table = createSvelteTable({
		get data() {
			return data.members;
		},
		columns,
		getCoreRowModel: getCoreRowModel()
	});
</script>

Members

<form action=""></form>
<Table.Root>
	<Table.Header>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<Table.Row>
				{#each headerGroup.headers as header (header.id)}
					<Table.Head>
						{#if !header.isPlaceholder}
							<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body>
		{#each table.getRowModel().rows as row (row.id)}
			<Table.Row data-state={row.getIsSelected() && 'selected'}>
				{#each row.getVisibleCells() as cell (cell.id)}
					<Table.Cell>
						<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
