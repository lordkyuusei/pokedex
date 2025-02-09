<script>
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	import { isMobile } from '$lib/store/device';
	import DesktopLayout from '$lib/components/chassis/DesktopLayout.svelte';
	import MobileLayout from '$lib/components/chassis/MobileLayout.svelte';

	import routes from './(app)/routes.json';
</script>

{#if $isMobile}
	<MobileLayout {routes} generationsList={[]}>
		<h1>{$page.status}: {$page.error.message}</h1>
	</MobileLayout>
{:else}
	<DesktopLayout {routes} routeId={$page.route.id} isDev={dev} generationsList={[]}>
		<h1>{$page.status}: {$page.error.message}</h1>
	</DesktopLayout>
{/if}
