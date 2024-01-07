<script>
	import { page } from '$app/stores';
	import { dev } from '$app/environment';

	import { device } from '$lib/store/device';
	import DesktopLayout from '$lib/components/interface/DesktopLayout.svelte';
	import MobileLayout from '$lib/components/interface/MobileLayout.svelte';

	import routes from './(app)/routes.json';
</script>

{#if $device !== 'mobile'}
	<DesktopLayout {routes} routeId={$page.route.id} isDev={dev} generationsList={[]}>
		<h1>{$page.status}: {$page.error.message}</h1>
	</DesktopLayout>
{:else}
	<MobileLayout {routes} generationsList={[]}>
		<h1>{$page.status}: {$page.error.message}</h1>
	</MobileLayout>
{/if}
