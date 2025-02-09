<script lang="ts">
	import { fade } from 'svelte/transition';
	import { browser } from '$app/environment';

	import t from '$lib/store/i18n';
	import { generation } from '$lib/store/generation';
	import Album from '$lib/components/lodestones/moves/Album.svelte';

	let movesList: Promise<[string, number]>;

	$: if ($generation && browser) {
		movesList = fetch(`/api/moves/gen/${$generation.id}`).then(async (x) => x.json());
	}

</script>

<section id="moves">
	<header class="header-name">
		{$t('moves.title')} {$generation?.id}
	</header>
	<div id="moves-list">
		{#await movesList then moves}
			{#each [...moves] as [type, count], i}
				<a href="/moves/{type}" in:fade={{ delay: 25 * i }} out:fade>
					<Album {type} {count} />
				</a>
			{/each}
		{/await}
	</div>
</section>

<style>
	section#moves {
		display: grid;
		grid-template: auto 1fr / 100%;
		height: 100%;
		width: 100%;
		padding-inline: var(--small-gap);

		@media (min-width: 640px) {
			padding-block: var(--small-gap);
			padding-inline: var(--large-gap);
		}

		& > .header-name {
			font-size: x-large;
			text-align: center;
			text-transform: uppercase;
			letter-spacing: 2px;
			margin-bottom: var(--small-gap);
			padding: var(--smaller-gap) var(--small-gap);
			border-radius: var(--border-r-50);
			background-color: var(--background-second-color);
		}

		& > div#moves-list {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
			gap: var(--normal-gap);
			align-items: center;

			overflow-y: auto;
			overflow-x: hidden;

			& > a {
				border-radius: var(--border-r-100);
			}

			@media (max-width: 640px) {
				grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
			}
		}
	}
</style>
