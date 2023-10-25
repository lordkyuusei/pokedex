<script lang="ts">
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';

	import _ from '$lib/store/i18n';
	import { generation } from '$lib/store/generation';
	import Album from '$lib/components/features/moves/Album.svelte';

	$: movesList =
		$generation && browser
			? fetch(`/api/moves/gen/${$generation.id}`).then(async (x) => await x.json())
			: [];

	$: header = $generation
		? $generation.id === 0
			? $_('moves.title-all')
			: $_('moves.title') + ` ${$generation.id}`
		: '';
</script>

<section id="moves">
	<h1 class="header-name">
		{header}
	</h1>
	<section id="moves-list">
		{#await movesList then moves}
			{#each [...moves] as [type, count], i}
				<a href="/moves/{type}" in:fade={{ delay: 25 * i }} out:fade>
					<Album {type} {count} />
				</a>
			{/each}
		{/await}
	</section>
</section>

<style>
	#moves {
		display: flex;
		flex-direction: column;
		gap: var(--small-gap);
		padding-block: 1em;
		padding-inline: 4em;
		height: 100%;
		width: 100%;
	}

	#moves > #moves-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
		row-gap: 2em;
		column-gap: var(--normal-gap);

		align-items: center;
		width: 100%;
		height: 100%;

		overflow-x: scroll;
	}

	#moves > .header-name {
		font-size: 1.8em;
		text-align: center;
		background-color: var(--background-accent);
		text-transform: uppercase;
		padding: 0.7em 1em;
		margin: 0;
		min-width: 5em;
		letter-spacing: 2px;
		border-radius: var(--border-r-200);
	}
</style>
