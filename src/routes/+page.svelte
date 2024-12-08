<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ShortenURLDialog from '$lib/components/ShortenURLDialog.svelte';
	import { LinkIcon } from 'lucide-svelte';

	const { form, data } = $props();

	const formatRelative = (date: Date) => {
		const secondsDiff = (date.getTime() - Date.now()) / 1000;

		const unitsInSec = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

		// Array equivalent to the above but in the string representation of the units
		const unitStrings = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'] as const;

		// Find the appropriate unit based on the seconds difference
		const unitIndex = unitsInSec.findIndex((cutoff) => cutoff > Math.abs(secondsDiff));

		// Get the divisor to convert seconds to the appropriate unit
		const divisor = unitIndex ? unitsInSec[unitIndex - 1] : 1;

		// Initialize Intl.RelativeTimeFormat
		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

		return rtf.format(Math.round(secondsDiff / divisor), unitStrings[unitIndex]);
	};
</script>

<div class="mx-auto max-w-screen-md px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-4xl font-bold">Your URLs</h1>
		<ShortenURLDialog error={form?.error} />
	</div>

	{#if !data.urls?.length}
		<div class="rounded-lg bg-muted py-12 text-center">
			<div class="mb-4 text-muted-foreground">
				<LinkIcon class="mx-auto h-12 w-12" />
			</div>
			<h3 class="mb-2 text-lg font-medium">No URLs yet</h3>
			<p class="mb-4 text-muted-foreground">Create your first shortened URL to get started</p>
			<ShortenURLDialog error={form?.error} />
		</div>
	{:else}
		<div class="mt-4 grid gap-6">
			{#each data.urls ?? [] as url}
				<Card.Root>
					<Card.Header>
						<Card.Title class="underline">
							<a href="/{url.id}" class="flex gap-2">{url.name ?? url.id}</a>
						</Card.Title>
						<Card.Description>Created {formatRelative(url.createdAt)}</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-muted-foreground">{url.redirectUrl}</p>
					</Card.Content>
					<Card.Footer class="gap-2">
						<Button variant="secondary">Edit</Button>
						<Button variant="ghost">Delete</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
