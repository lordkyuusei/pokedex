<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
		onRegistered(r) {
			console.log(`SW Registered: ${r}`);
		},
		onRegisterError(error) {
			console.log('SW registration error', error);
		}
	});

	$: shouldShow = $offlineReady || $needRefresh;
</script>

{#if shouldShow && $needRefresh}
	<button id="update-pokedex" title="Mise à jour disponible" on:click={() => updateServiceWorker(true)}>🔄️</button>
{/if}

<style>
</style>
