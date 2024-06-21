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
	const close = () => {
		offlineReady.set(false);
		needRefresh.set(false);
	};

	$: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
	<div class="pwa-toast" role="alert">
		<div class="message">
			{#if $offlineReady}
				<span> App ready to work offline </span>
			{:else}
				<span> New content available, click on reload button to update. </span>
			{/if}
		</div>
		{#if $needRefresh}
			<button on:click={() => updateServiceWorker(true)}> Reload </button>
		{/if}
		<button on:click={close}> Close </button>
	</div>
{/if}

<style>
	.pwa-toast {
		position: fixed;
		right: 0;
		bottom: 0;
		margin: 16px;
		padding: 12px;
		border-radius: 4px;
		z-index: 2;
		text-align: left;
		box-shadow: var(--box-shadow);
		color: var(--text-color);
		background-color: var(--background-color);
	}

	@media (max-width: 640px) {
		.pwa-toast {
			bottom: 5svh;
		}
	}

	.pwa-toast .message {
		margin-bottom: 8px;
	}

	.pwa-toast button {
		border: 1px solid var(--text-color);
		outline: none;
		margin-right: 5px;
		border-radius: 2px;
		padding: 3px 10px;
	}
</style>
