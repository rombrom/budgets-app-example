<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';

	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import PurchaseForm from './PurchaseForm.svelte';
	import { type ColumnDef } from '@tanstack/table-core';

	let { data } = $props();

	const columns: ColumnDef<(typeof data.purchases)[number]>[] = [
		{ accessorKey: 'id' },
		{ accessorKey: 'amount' },
		{ accessorKey: 'budget.name' },
		{ accessorKey: 'member.email' },
		{ accessorKey: 'createdAt' },
		{ accessorKey: 'updatedAt' }
	];
</script>

Purchases

<PurchaseForm action="?/create" budgets={data.budgets} form={data.form} members={data.members} />
<DataTable {columns} data={data.purchases} />
