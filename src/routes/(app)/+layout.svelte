<svelte:options immutable={true} />

<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import type { LayoutServerData } from './$types';

	import { theme, variant } from '$lib/store/theme';
	import { deviceWidth, isMobile, isRendered } from '$lib/store/device';

	import SVGs from '$lib/components/common/SVGs.svelte';
	import DesktopLayout from '$lib/components/interface/DesktopLayout.svelte';
	import MobileLayout from '$lib/components/interface/MobileLayout.svelte';

	import routes from './routes.json';
	import '../app.css';

	export let data: LayoutServerData;
</script>

<svelte:head>
	<meta name="color-scheme" content={$theme === 'moon' ? 'dark' : 'light'} />
	{#if $theme && $variant}
		<link rel="stylesheet" href={`/theme/${$theme}-${$variant}.css`} />
	{/if}
</svelte:head>

<svelte:window bind:innerWidth={$deviceWidth} />

<SVGs />
{#if $isRendered && $isMobile}
	<MobileLayout {routes} generationsList={data.generationsList}>
		<slot />
	</MobileLayout>
{:else if $isRendered && !($isMobile)}
	<DesktopLayout
		{routes}
		routeId={$page.route.id}
		isDev={dev}
		generationsList={data.generationsList}
	>
		<slot />
	</DesktopLayout>
{/if}