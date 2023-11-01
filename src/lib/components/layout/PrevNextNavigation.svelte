<script lang="ts">
	import { afterUpdate, beforeUpdate } from 'svelte';
	import { page } from '$app/stores';
	import pokemon from '$lib/store/pokemon';
	import { lang } from '$lib/store/lang';

	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import { LAST_POKEMON_KNOWN_ID } from '$lib/constants/global';

	$: pkmnId = $pokemon?.id ?? 0;
	$: [_, __, path, ___, infoType] = $page.route.id?.split('/') ?? [];

	$: pkmnPrevId = Math.max(pkmnId - 1, 0);
	$: pkmnLocalName = $pokemon?.names.find((x) => x.language.name === $lang)?.name ?? '';
	$: pkmnNextId = Math.min(pkmnId + 1, LAST_POKEMON_KNOWN_ID);
</script>

{#if path === 'pokemon'}
	<div id="dex-pokemon-header">
		{#if pkmnPrevId !== 0}
			<a href="/pokemon/{pkmnPrevId}/{infoType}" class="navigation-button" title={`${pkmnPrevId}`}>
				<img class="navigation-prev" src="/arrow.svg" alt="pokemon {pkmnPrevId}" />
				<img
					class="pokemon-sprite"
					src={fetchPokemonSpriteURL(pkmnPrevId, 'icons', 'generation-viii')}
					alt="pokemon {pkmnPrevId}"
				/>
			</a>
		{/if}
		<h1 class="header-name">{pkmnLocalName}</h1>
		{#if pkmnNextId !== LAST_POKEMON_KNOWN_ID}
			<a href="/pokemon/{pkmnNextId}/{infoType}" class="navigation-button" title={`${pkmnNextId}`}>
				<img
					class="pokemon-sprite"
					src={fetchPokemonSpriteURL(pkmnNextId, 'icons', 'generation-viii')}
					alt="pokemon {pkmnNextId}"
				/>
				<img src="/arrow.svg" class="navigation-next" alt="pokemon {pkmnNextId}" />
			</a>
		{/if}
	</div>
{/if}

<style>
	#dex-pokemon-header {
		display: grid;
		gap: var(--small-gap);
		place-items: center;

		@media (min-width: 640px) {
			padding-inline: 1rem;
			grid-template: 100% / 1fr 1.5fr 1fr;
		}

		@media (max-width: 640px) {
			grid-template: 100% / 1fr 9fr 1fr;
		}

		& > .header-name {
			font-size: x-large;
			text-align: center;
			text-transform: uppercase;
			min-width: 5em;
			border-radius: var(--border-r-200);
			margin-block: 0;

			@media (min-width: 640px) {
				padding: 0.75em 1em;
				letter-spacing: 2px;
				background-color: var(--background-accent);
			}

			@media (max-width: 640px) {
				background-color: transparent;
				color: rgba(255, 255, 255, 0.3);
				scale: 2;
			}
		}

		& > .navigation-button {
			background-color: var(--text-color);
			border-radius: var(--border-r-200);
			border: none;
			cursor: pointer;
			display: grid;
			grid-template: 100% / 1fr 1fr;
			place-items: center;

			& > .pokemon-sprite {
				object-fit: cover;
				object-position: 0px -5px;
			}

			& > .navigation-next {
				transform: rotate(180deg);
			}
		}
	}

	@media (max-width: 640px) {
		a.navigation-button:first-child {
			grid-template-columns: 50% 50%;
			border-radius: 0 var(--border-r-200) var(--border-r-200) 0 !important;
		}

		a.navigation-button:last-child {
			border-radius: var(--border-r-200) 0 0 var(--border-r-200) !important;
		}

		a.navigation-button:first-child > img {
			grid-column: 2;
		}

		img[class^='navigation'] {
			display: none;
		}
	}
</style>
