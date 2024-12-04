<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_ROOT_URL } from '$env/static/public';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { LoaderIcon } from 'lucide-svelte';

	let isLoading = $state(false);
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create Short URL</Dialog.Title>
			<Dialog.Description>Create a short URL that redirects to a longer URL.</Dialog.Description>
		</Dialog.Header>

		<form
			method="POST"
			use:enhance={() => {
				isLoading = true;
				return async ({ update }) => {
					isLoading = false;
					update();
				};
			}}
		>
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="short_url" class="text-right">Short Path</Label>
					<Input type="text" id="short_url" name="short_url" placeholder="yt" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="redirect_url" class="text-right">Redirect URL</Label>
					<Input
						type="text"
						id="redirect_url"
						name="redirect_url"
						placeholder="https://youtube.com"
						class="col-span-3"
					/>
				</div>
			</div>
			<Dialog.Footer>
				{#if !isLoading}
					<Button type="submit">Create Shortened Link</Button>
				{:else}
					<Button type="button" disabled>
						<LoaderIcon class="animate-spin" />
						Creating...
					</Button>
				{/if}
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
