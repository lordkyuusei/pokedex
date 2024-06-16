<script lang="ts">
	import { fade } from 'svelte/transition';

	import Type from '$lib/components/common/Type.svelte';
	import Switch from '$lib/components/common/Switch.svelte';
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import {
		fetchPokemonShinySpriteURL,
		fetchPokemonSpriteURL
	} from '$lib/functions/getPokemonSpritesURL';

	import TypesRelationship from './TypesRelationship.svelte';
	import { isMobile } from '$lib/store/device';
	import PrevNextNavigation from '$lib/components/layout/PrevNextNavigation.svelte';

	export let id: number = 0;
	export let sprite: string = '';
	export let types: string[] = [];

	$: artwork = fetchPokemonSpriteURL(id, undefined, undefined, '/other/official-artwork/');
	$: shinySprite = fetchPokemonShinySpriteURL(id);

	let toggleShiny: boolean = false;
	let toggleTypes: boolean = false;
	let toggleCover: boolean = false;
</script>

<section
	id="stats-main"
	in:fade={{ delay: 50 }}
	class:main={!toggleTypes}
	style:background={drawBookBackground(types, $isMobile)}
>
	<header id="main-buttons">
		<Switch
			event="typesTable"
			icon="pokedex"
			on:typesTable={(e) => (toggleTypes = e.detail.typesTable)}
		/>
		{#if !toggleTypes}
			<Switch
				event="shinyCover"
				icon="shiny"
				on:shinyCover={(e) => (toggleShiny = e.detail.shinyCover)}
			/>
		{:else}
			<Switch
				event="coverage"
				icon="pokedex"
				on:coverage={(e) => (toggleCover = e.detail.coverage)}
			/>
		{/if}
	</header>
	{#if !toggleTypes}
		{#if $isMobile}
			<div id="prev-next-nav">
				<PrevNextNavigation />
			</div>
		{:else}
			<img class="main-illustration" src={artwork} alt={`${id}`} />
		{/if}
		<figure class="main-image">
			<img
				src={!toggleShiny ? sprite : shinySprite}
				alt={`${id}`}
				on:error={(e) => (e.currentTarget.src = sprite)}
			/>
		</figure>
		<footer id="main-types">
			{#each types as type}
				<Type {type} />
			{/each}
		</footer>
	{:else}
		<TypesRelationship {types} show={toggleCover} />
	{/if}
</section>

<style>
	#stats-main {
		display: grid;
		place-items: center;

		height: 100%;
		border-radius: var(--border-r-50) var(--border-r-200) 0 var(--border-r-200);
		position: relative;
		overflow-y: auto;
		box-shadow: var(--box-shadow);

		&::-webkit-scrollbar {
			display: none;
		}

		&.main {
			grid-template: 8svh 2fr 1fr / 100%;
		}

		&:not(.main) {
			grid-template: 8svh auto / 100%;
			padding-block-end: var(--small-gap);
		}

		& > #main-buttons {
			grid-area: 1/1;

			position: sticky;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-inline: var(--normal-gap);
			height: 100%;
			width: 100%;
			backdrop-filter: brightness(0.8);
			-webkit-backdrop-filter: brightness(0.8);
			z-index: 2;
		}

		& .main-illustration {
			height: 100%;
			filter: opacity(0.2) grayscale(0.9);
			pointer-events: none;
			grid-area: 1 / 1 / 4 / 1;
			transform: translateX(35%);
		}

		& .main-image {
			grid-area: 2/1;
			position: relative;

			&::after {
				content: '';
				position: absolute;

				bottom: -5%;
				left: calc(75% - 100%);
				height: 50%;
				width: 150%;
				border-radius: 50%;
				background-color: var(--background-color);
				opacity: 0.25;
				z-index: 0;
			}

			& > img {
				position: relative;
				transform: scale(1.5) translateY(-0.5em);
				image-rendering: pixelated;
				z-index: 1;
			}
		}

		& > #prev-next-nav {
			grid-area: 2 / 1;
			width: 100%;
		}

		& > #main-types {
			grid-area: 3 / 1;
			display: flex;
			justify-content: space-between;
			padding-inline: 3em;
			gap: var(--normal-gap);
			z-index: 2;
		}
	}

	@media (max-width: 640px) {
		#stats-main {
			overflow: auto;

			border-radius: 0;
			box-shadow: none;
		}

		.main {
			grid-template: 5svh 2fr 1fr / 100% !important;
		}
	}
</style>
