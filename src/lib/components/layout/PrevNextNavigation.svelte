<script lang="ts">
	import { page } from '$app/stores';
	import pokemon from '$lib/store/pokemon';
	import { lang } from '$lib/store/lang';

	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import { LAST_POKEMON_KNOWN_ID } from '$lib/constants/global';
	import { navigatePokemon } from '$lib/functions/navigate';
	import onImgError from '$lib/functions/fixImgLoadingError';

	$: pkmnId = $pokemon?.id ?? 0;
	$: pkmnPrevId = Math.max(pkmnId - 1, 0);
	$: pkmnLocalName = $pokemon?.names.find((x) => x.language.name === $lang)?.name ?? '';
	$: pkmnNextId = Math.min(pkmnId + 1, LAST_POKEMON_KNOWN_ID);
</script>

{#if $page.route.id?.includes('pokemon')}
	<div id="dex-pokemon-header">
		{#if pkmnPrevId !== 0}
			<a
				href={navigatePokemon(pkmnPrevId, $page)}
				class="navigation-button"
				title={`${pkmnPrevId}`}
			>
				<img class="navigation-prev" src="/arrow.svg" alt="pokemon {pkmnPrevId}" />
				<img
					class="pokemon-sprite"
					src={fetchPokemonSpriteURL(pkmnPrevId, 'icons', 'generation-viii')}
					alt="pokemon {pkmnPrevId}"
					on:error={onImgError}
				/>
			</a>
		{/if}
		<h1 class="header-name">{pkmnLocalName}</h1>
		{#if pkmnNextId !== LAST_POKEMON_KNOWN_ID}
			<a
				href={navigatePokemon(pkmnNextId, $page)}
				class="navigation-button"
				title={`${pkmnNextId}`}
			>
				<img
					class="pokemon-sprite"
					src={fetchPokemonSpriteURL(pkmnNextId, 'icons', 'generation-viii')}
					alt="pokemon {pkmnNextId}"
					on:error={onImgError}
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
			grid-template: 100% / 1fr auto 1fr;
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
			letter-spacing: 2px;

			@media (min-width: 640px) {
				padding: 0.75em 1em;
				background-color: var(--background-color-__);
			}

			@media (max-width: 640px) {
				background-color: transparent;
				color: rgba(255, 255, 255, 0.3);
				scale: 2;
				translate: 0 -300%;
			}
		}

		& > .navigation-button {
			display: grid;
			grid-template: 100% / 1fr 1fr;
			place-items: center;

			border-radius: var(--border-r-200);
			padding: 0;

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
		a.navigation-button {
			background-color: rgba(255, 255, 255, 0.5) !important;
		}
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
