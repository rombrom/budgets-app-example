<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	let {
		class: className,
		id,
		name,
		value: formValue = $bindable()
	}: { class?: string; id?: string; name: string; value?: Date } = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $state<DateValue | undefined>();
	let contentRef = $state<HTMLElement | null>(null);

	let inputValue = $derived(value?.toString());
</script>

<input hidden value={inputValue} {name} />

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'w-[280px] justify-start text-left font-normal'
			}),
			!value && 'text-muted-foreground',
			className
		)}
		{id}
	>
		<CalendarIcon />
		{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto p-0">
		<Calendar
			type="single"
			bind:value
			onValueChange={(value) => {
				if (value) formValue = value.toDate(getLocalTimeZone());
				else formValue = undefined;
			}}
		/>
	</Popover.Content>
</Popover.Root>
