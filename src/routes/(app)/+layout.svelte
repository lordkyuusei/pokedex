<svelte:options immutable={true} />

<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import type { LayoutServerData } from '../$types';

	import { theme } from '$lib/store/theme';
	import { deviceWidth, isMobile } from '$lib/store/device';

	import SVGs from '$lib/components/common/SVGs.svelte';
	import DesktopLayout from '$lib/components/interface/DesktopLayout.svelte';
	import MobileLayout from '$lib/components/interface/MobileLayout.svelte';

	import routes from './routes.json';

	export let data: LayoutServerData;
</script>

<svelte:head>
	<meta name="color-scheme" content={$theme === 'moon' ? 'dark' : 'light'} />
	{#if $theme}
		<link rel="stylesheet" href={`/theme/${$theme}.css`} />
	{/if}
</svelte:head>

<svelte:window bind:innerWidth={$deviceWidth} />

<SVGs />
{#await import('$lib/components/layout/UpdateSW.svelte') then { default: UpdateSW }}
	<UpdateSW />
{/await}
{#if $isMobile}
	<MobileLayout {routes} generationsList={data.generationsList}>
		<slot />
	</MobileLayout>
{:else}
	<DesktopLayout
		{routes}
		routeId={$page.route.id}
		isDev={dev}
		generationsList={data.generationsList}
	>
		<slot />
	</DesktopLayout>
{/if}
