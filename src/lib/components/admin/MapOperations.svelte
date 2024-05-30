<script lang="ts">
	import { saveStatus } from '$lib/store/save';
	import { syncLocationsToVersion } from '$lib/functions/syncLocationsToVersion';
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
	<!-- <details>
		<summary>Fix locations by inverting bot left and bot right values</summary>
		<div class="versions-choice">
			<input id="version-from" bind:value={fromVersion} type="text" readonly />
			<button on:click={() => (fromVersion = $version)}>Set source</button>
		</div>
		<div class="versions-exec">
			<button on:click={() => fixLocations(fromVersion)}>Fix</button>
			<code>{$saveStatus.status}</code>
		</div>
	</details> -->
</div>

<style>
	details {
		& > summary {
			padding: var(--smaller-gap) var(--small-gap);
			background-color: var(--background-color-__);
			border-radius: var(--border-r-50);
			margin-bottom: var(--smaller-gap);
			cursor: pointer;
		}
	}
	.versions-choice {
		display: grid;
		grid-template: auto / 1fr auto 1fr auto;
		gap: var(--small-gap);
		margin-bottom: var(--smaller-gap);
	}
</style>
