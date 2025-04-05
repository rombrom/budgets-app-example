<script lang="ts">
	import { toast } from 'svelte-sonner';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { formSchema } from './schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';

	let rootProps: {
		action: string;
		form: SuperValidated<Infer<typeof formSchema>>;
		teams: { id: number; name: string | null }[];
	} = $props();

	const form = superForm(rootProps.form, {
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success(`Created budget "${form.data.name}" with \$${form.data.amount} allowance.`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		},
		validators: valibotClient(formSchema)
	});

	const { form: formData, enhance } = form;
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

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input {...props} bind:value={$formData.name} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="teamId">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Team</Form.Label>
				<Select.Root type="single" bind:value={$formData.teamId} name={props.name}>
					<Select.Trigger {...props}>
						{rootProps.teams.find(({ id }) => String(id) === $formData.teamId)?.name ??
							'Select a team'}
					</Select.Trigger>
					<Select.Content>
						{#each rootProps.teams as team (team.id)}
							<Select.Item value={String(team.id)} label={team.name ?? String(team.id)} />
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="validFrom">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Valid From</Form.Label>
				<DatePicker {...props} bind:value={$formData.validFrom} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="validUntil">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Valid Until</Form.Label>
				<DatePicker {...props} bind:value={$formData.validUntil} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
