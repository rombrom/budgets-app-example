<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Trash from '@lucide/svelte/icons/trash';

	let { action, email, id }: { action: string; email: string; id: number } = $props();
</script>

<form method="POST" {action}>
	<Button name="id" value={id} type="submit">
		<Trash />
		<span class="sr-only">Delete {email}</span>
	</Button>
</form>
