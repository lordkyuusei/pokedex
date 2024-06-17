<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<section id="administration">
	<header id="sync-buttons">
		<form method="POST" action="?/syncPokemonList">
			<button type="submit">Sync Pokemon List</button>
		</form>
		<form method="POST" action="?/syncGenerationsList">
			<button type="submit">Sync Generations List</button>
		</form>
		<form method="POST" action="?/syncMovesList">
			<button type="submit">Sync Moves List</button>
		</form>
		<form method="POST" action="?/syncAbilitiesList">
			<button type="submit">Sync Abilities List</button>
		</form>
		<form method="POST" action="?/syncLocationsList">
			<button type="submit">Sync Locations List</button>
		</form>
	</header>

	{#if form?.name}
		<pre>[{form.name}] Synced {form.items} items into database 👌</pre>
	{/if}
</section>

<style>
	#sync-buttons {
		display: flex;
		gap: var(--small-gap);
		padding: var(--small-gap);
	}

	button {
		font-size: 1.5rem;
		color: var(--primary-color);
		background-color: var(--background-secondary);
		border: 1px solid var(--background-color-__);
		border-radius: var(--border-r-100);
		height: 100%;
		padding: var(--small-gap);
		cursor: pointer;
	}
</style>
