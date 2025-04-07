<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { formSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import type * as table from '$lib/server/db/schema';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { getFlash } from 'sveltekit-flash-message';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/state';

	let rootProps: {
		action: string;
		// this is awkward; cannot use materialized view types...
		budgets: (typeof table.budget.$inferSelect & {
			spent: number | null;
			remaining: number | null;
			team: typeof table.team.$inferSelect;
		})[];
		form: SuperValidated<Infer<typeof formSchema>>;
		members: { id: number; email: string; teamId: number | null }[];
	} = $props();

	const flash = getFlash(page);

	const form = superForm(rootProps.form, {
		onUpdated: ({ form }) => {
			if (form.valid && $flash?.type !== 'error') {
				toast.success(`Created purchase for ${form.data.amount}.`);
			} else {
				toast.error($flash?.message ?? 'Please fix the errors in the form.');
			}
		},
		validators: valibotClient(formSchema)
	});

	const { form: formData, enhance } = form;

	let selectedBudget = $derived(
		rootProps.budgets.find(({ id }) => String(id) === $formData.budgetId)
	);

	let members = $derived(
		rootProps.members.filter(({ teamId }) => teamId === selectedBudget?.teamId)
	);
</script>

<form action={rootProps.action} method="POST" use:enhance>
	<Form.Field {form} name="amount">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Amount</Form.Label>
				<Input {...props} bind:value={$formData.amount} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="budgetId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Budget</Form.Label>
				<Select.Root type="single" bind:value={$formData.budgetId} name={props.name}>
					<Select.Trigger {...props}>
						{selectedBudget
							? `${selectedBudget.name} (${selectedBudget.remaining ?? 0})`
							: 'Select a budget'}
					</Select.Trigger>
					<Select.Content>
						{#each rootProps.budgets as budget (budget.id)}
							<Select.Item
								disabled={(budget.remaining ?? 0) <= Number($formData.amount)}
								value={String(budget.id)}
								label={`${budget.name ?? String(budget.id)} (${budget.remaining ?? 0})`}
							/>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="memberId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Member</Form.Label>
				<Select.Root type="single" bind:value={$formData.memberId} name={props.name}>
					<Select.Trigger {...props}>
						{members.find(({ id }) => String(id) === $formData.memberId)?.email ??
							'Select a member'}
					</Select.Trigger>
					<Select.Content>
						{#each members as member (member.id)}
							<Select.Item value={String(member.id)} label={member.email ?? String(member.id)} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
