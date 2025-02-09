<script lang="ts">
	import { saveStatus } from '$lib/store/save';
	import { applyDefaultLocationsToVersion, syncLocationsToVersion } from '$lib/functions/syncLocationsToVersion';
	import { version } from '$lib/store/generation';

	let fromVersion: string | null = null;
	let toVersion: string | null = null;
</script>

<div>
	<details>
		<summary>Sync locations between versions</summary>
		<div class="versions-choice">
			<input id="version-from" bind:value={fromVersion} type="text" readonly />
			<button on:click={() => (fromVersion = $version)}>Set {$version} as source</button>
			<input id="version-to" bind:value={toVersion} type="text" readonly />
			<button on:click={() => (toVersion = $version)}>Set {$version} as destination</button>
		</div>
		<div class="versions-exec">
			<button on:click={() => syncLocationsToVersion(fromVersion, toVersion)}>Synchronize</button>
			<code>{$saveStatus.status}</code>
		</div>
	</details>
	<details>
		<summary>Fix locations by inverting bot left and bot right values</summary>
		<div class="versions-choice">
			<input id="version-from" bind:value={fromVersion} type="text" readonly />
			<button on:click={() => (fromVersion = $version)}>Set source</button>
		</div>
		<div class="versions-exec">
			<button on:click={() => (/* fixLocations(fromVersion)*/ true)}>Fix</button>
			<code>{$saveStatus.status}</code>
		</div>
	</details>
	<details>
		<summary>Apply default location</summary>
		<div class="versions-choice">
			<input id="version-from" bind:value={fromVersion} type="text" readonly />
			<button on:click={() => (fromVersion = $version)}>Set {$version} as source</button>
		</div>
		<div class="versions-exec">
			<button on:click={() => applyDefaultLocationsToVersion(fromVersion)}>Synchronize</button>
			<code>{$saveStatus.status}</code>
		</div>
	</details>
</div>

<style>
	details {
		& > summary {
			padding: var(--smaller-gap) var(--small-gap);
			background-color: var(--background-second-color);
			border-radius: var(--border-r-50);
			margin-bottom: var(--smaller-gap);
			cursor: pointer;
		}

		& > input {
			background-color: var(--background-color);
		}
	}

	.versions-choice {
		display: grid;
		grid-template: auto auto / 1fr auto;
		gap: var(--small-gap);
		margin-bottom: var(--smaller-gap);
	}
</style>
