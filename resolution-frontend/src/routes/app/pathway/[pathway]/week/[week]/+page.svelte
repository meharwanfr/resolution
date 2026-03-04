<script lang="ts">
	import type { PageData } from './$types';
	import WeekLayout from '$lib/components/WeekLayout.svelte';

	let { data }: { data: PageData } = $props();
</script>

<WeekLayout
	pathwayId={data.pathwayId}
	weekNumber={data.weekNumber}
	title={data.title}
	content={data.content}
/>
