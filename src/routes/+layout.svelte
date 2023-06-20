<svelte:options immutable={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import type { LayoutServerData } from './$types';

	import { theme } from '$lib/store/theme';
	import { deviceWidth, isMobile, device } from '$lib/store/device';

	import SVGs from '$lib/components/common/SVGs.svelte';
	import routes from './routes.json';
	import DesktopLayout from '$lib/components/interface/DesktopLayout.svelte';
	import MobileLayout from '$lib/components/interface/MobileLayout.svelte';

	export let data: LayoutServerData;

	onMount(() => {
		$isMobile = data.mobile;
	});
</script>

<svelte:head>
	<meta name="color-scheme" content={$theme === 'moon' ? 'dark' : 'light'} />
	{#if $theme}
		<link rel="stylesheet" href={`/theme/${$theme}.css`} />
	{/if}
</svelte:head>

<svelte:window bind:outerWidth={$deviceWidth} />

<SVGs />
{#if $device !== 'mobile'}
	<DesktopLayout
		{routes}
		routeId={$page.route.id}
		isDev={dev}
		generationsList={data.generationsList}
	>
		<slot />
	</DesktopLayout>
{:else}
	<MobileLayout {routes} generationsList={data.generationsList}>
		<slot />
	</MobileLayout>
{/if}
