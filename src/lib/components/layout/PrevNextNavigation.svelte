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
				class="navigation-button prev"
				title={`${pkmnPrevId}`}
			>
				<svg class="navigation-prev">
					<use href="#icon-arrow"></use>
				</svg>
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
				class="navigation-button next"
				title={`${pkmnNextId}`}
			>
				<img
					class="pokemon-sprite"
					src={fetchPokemonSpriteURL(pkmnNextId, 'icons', 'generation-viii')}
					alt="pokemon {pkmnNextId}"
					on:error={onImgError}
				/>
				<svg class="navigation-next">
					<use href="#icon-arrow"></use>
				</svg>
			</a>
		{/if}
	</div>
{:else}
	<span></span>
{/if}

<style>
	#dex-pokemon-header {
		height: 100%;
		display: flex;
		gap: var(--small-gap);
		align-items: center;

		@media (min-width: 640px) {
			padding-inline: var(--small-gap);
		}

		@media (max-width: 640px) {
			justify-content: space-between;
		}

		& > .header-name,
		& > .navigation-button {
			display: grid;
			place-items: center;
			border-radius: var(--border-r-50);
			padding-inline: var(--smallest-gap);
			height: 100%;
		}

		& > .header-name {
			text-transform: uppercase;
			letter-spacing: 2px;

			@media (min-width: 640px) {
				padding-inline: var(--small-gap);
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
			grid-template: 100% / 1fr 1fr;

			& svg {
				height: 100%;
				aspect-ratio: 1;
			}

			&.prev {
				grid-column: 1;
			}

			&.next {
				grid-column: 3;
			}

			& > .pokemon-sprite {
				object-fit: cover;
				object-position: 0px -5px;
			}

			& > .navigation-prev {
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
	}
</style>
