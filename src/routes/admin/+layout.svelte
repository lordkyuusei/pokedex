<svelte:options immutable={true} />

<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import type { LayoutServerData } from '../$types';

	import { theme, variant } from '$lib/store/theme';

	import SVGs from '$lib/components/common/SVGs.svelte';
	import DesktopLayout from '$lib/components/interface/DesktopLayout.svelte';

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

{#if dev}
	<SVGs />
	<DesktopLayout
		{routes}
		routeId={$page.route.id}
		isDev={dev}
		generationsList={data.generationsList}
	>
		<slot />
	</DesktopLayout>
{/if}

<style>
	div {
		height: 100svh;
		width: 100svw;
		background-color: var(--background-color-____);
	}
</style>
