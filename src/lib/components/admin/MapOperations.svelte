<script lang="ts">
	import { saveStatus } from '$lib/store/save';
	import syncLocationsToVersion from '$lib/functions/syncLocationsToVersion';
	import { version } from '$lib/store/generation';

	let fromVersion: string | null = null;
	let toVersion: string | null = null;
</script>

<div>
	<details>
		<summary>Sync locations between versions</summary>
		<div class="versions-choice">
			<input id="version-from" bind:value={fromVersion} type="text" readonly />
			<button on:click={() => (fromVersion = $version)}>Set source</button>
			<input id="version-to" bind:value={toVersion} type="text" readonly />
			<button on:click={() => (toVersion = $version)}>Set destination</button>
		</div>
		<div class="versions-exec">
			<button on:click={() => syncLocationsToVersion(fromVersion, toVersion)}>Synchronize</button>
			<code>{$saveStatus.status}</code>
		</div>
	</details>
</div>

<style>
	.versions-choice {
		display: grid;
		grid-template: auto / 1fr auto 1fr auto;
		gap: var(--small-gap);
	}
</style>
