<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import { buttonVariants } from '$lib/components/ui/button';

	import * as Dialog from '$lib/components/ui/dialog/index.js';
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

<div class="flex gap-8 p-8">
	<div class="prose">
		<h2>Purchases</h2>
	</div>

	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>New Purchase</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>New Purchase</Dialog.Title>
			</Dialog.Header>
			<PurchaseForm
				action="?/create"
				budgets={data.budgets}
				form={data.form}
				members={data.members}
			/>
		</Dialog.Content>
	</Dialog.Root>
</div>

<DataTable {columns} data={data.purchases} />
