<script lang="ts">
	import DataTable from '$lib/components/DataTable.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { formSchema } from './schema';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form/index.js';
	import { superForm } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type ColumnDef } from '@tanstack/table-core';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	const columns: ColumnDef<(typeof data.teams)[number]>[] = [
		{ accessorKey: 'id' },
		{ accessorKey: 'name' },
		{ accessorKey: 'createdAt' },
		{ accessorKey: 'updatedAt' }
	];

	const form = superForm(data.form, {
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Created team "${form.data.name}".`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		},
		validators: valibotClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex gap-8 p-8">
	<div class="prose">
		<h2>Teams</h2>
	</div>

	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>New Team</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>New Team</Dialog.Title>
			</Dialog.Header>
			<form action="?/create" method="POST" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Team Name</Form.Label>
							<Input {...props} bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button type="submit">Create</Form.Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
</div>

<DataTable {columns} data={data.teams} />
