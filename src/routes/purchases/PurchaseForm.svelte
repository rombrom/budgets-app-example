<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { formSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	let rootProps: {
		action: string;
		budgets: { id: number; name: string | null; teamId: number | null }[];
		form: SuperValidated<Infer<typeof formSchema>>;
		members: { id: number; email: string; teamId: number | null }[];
	} = $props();

	const form = superForm(rootProps.form, {
		validators: valibotClient(formSchema)
	});

	const { form: formData, enhance } = form;

	// TODO: compute optimal budget. assumption will be that the budget which
	//       has most spent but still fits the purchase is optimum.
	// let suggestedBudget = $derived();

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
						{selectedBudget?.name ?? 'Select a budget'}
					</Select.Trigger>
					<Select.Content>
						{#each rootProps.budgets as budget (budget.id)}
							<Select.Item value={String(budget.id)} label={budget.name ?? String(budget.id)} />
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
