<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { DateFormatter } from '@internationalized/date';
	import BudgetForm from './BudgetForm.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { type ColumnDef } from '@tanstack/table-core';

	let { data } = $props();

	const df = new DateFormatter('en', {
		dateStyle: 'long',
		timeStyle: 'short'
	});

	const columns: ColumnDef<(typeof data.budgets)[number]>[] = [
		{ accessorKey: 'id' },
		{ accessorKey: 'amount' },
		{ accessorKey: 'spent', cell: ({ row }) => row.original.spent ?? 0 },
		{ accessorKey: 'remaining', cell: ({ row }) => row.original.remaining ?? 0 },
		{ accessorKey: 'name' },
		{ accessorKey: 'team.name' },
		{ accessorKey: 'validFrom', cell: ({ row }) => df.format(row.original.validFrom!) },
		{ accessorKey: 'validUntil', cell: ({ row }) => df.format(row.original.validUntil!) },
		{ accessorKey: 'createdAt', cell: ({ row }) => df.format(row.original.createdAt!) },
		{ accessorKey: 'updatedAt', cell: ({ row }) => df.format(row.original.updatedAt!) }
	];
</script>

Budgets

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>New Budget</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>New Budget</Dialog.Title>
		</Dialog.Header>
		<BudgetForm action="?/create" form={data.form} teams={data.teams} />
	</Dialog.Content>
</Dialog.Root>

{#if data.budgets.length}
	<DataTable {columns} data={data.budgets} />
{:else}
	<p>No budgets</p>
{/if}
