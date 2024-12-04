<script lang="ts">
	import '../app.css';
	import { ClerkProvider } from 'clerk-sveltekit/client';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
	import { Toaster } from "$lib/components/ui/sonner";

	let { children } = $props();
</script>

<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY}>
	<Toaster />
	
	{@render children()}
</ClerkProvider>
