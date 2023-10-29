<svelte:options immutable={true} />

<script lang="ts">
	import { pwaInfo } from 'virtual:pwa-info';
	import { registerSW } from 'virtual:pwa-register';

	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import type { LayoutServerData } from '../$types';

	import { theme } from '$lib/store/theme';
	import { deviceWidth, device } from '$lib/store/device';

	import SVGs from '$lib/components/common/SVGs.svelte';
	import DesktopLayout from '$lib/components/interface/DesktopLayout.svelte';
	import MobileLayout from '$lib/components/interface/MobileLayout.svelte';

	import routes from './routes.json';
	import { onMount } from 'svelte';

	export let data: LayoutServerData;

	$: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	onMount(async () => {
		if (pwaInfo) {
			const updateSW = registerSW({
				immediate: true,
				onRegisteredSW(swScriptUrl, registration) {
					console.log(`SW Registered: ${swScriptUrl}`, registration);
				},
				onRegistered(r) {
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				},
				onOfflineReady() {
					console.log('SW: onofflineReady');
				},
				onNeedRefresh() {
					updateSW(true);
					console.log('SW: onNeedRefresh');
				}
			});
		}
	});
</script>

<svelte:head>
	<meta name="color-scheme" content={$theme === 'moon' ? 'dark' : 'light'} />
	{#if $theme}
		<link rel="stylesheet" href={`/theme/${$theme}.css`} />
	{/if}
	{@html webManifestLink}
</svelte:head>

<svelte:window bind:innerWidth={$deviceWidth} />

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
