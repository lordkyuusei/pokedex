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

	$: header = $_('moves.title') + ` ${$generation?.id}`;
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
		height: 100%;
		width: 100%;
		padding-inline: var(--small-gap);

		@media (min-width: 640px) {
			padding-block: 1em;
			padding-inline: 4em;
		}

		& > #moves-list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
			row-gap: 2em;
			column-gap: var(--normal-gap);

			align-items: center;
			width: 100%;
			height: 100%;

			overflow-x: scroll;

			& > a {
				padding: 0;
				background: none;
			}

			@media (max-width: 640px) {
				grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
			}
		}

		& > .header-name {
			font-size: x-large;
			text-align: center;
			background-color: var(--background-color-__);
			text-transform: uppercase;
			padding: var(--smaller-gap) var(--small-gap);
			margin: 0;
			min-width: 5em;
			letter-spacing: 2px;
			border-radius: var(--border-r-200);
		}
	}
</style>
