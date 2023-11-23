<script lang="ts">
	import { fade } from 'svelte/transition';

	import Type from '$lib/components/common/Type.svelte';
	import Switch from '$lib/components/common/Switch.svelte';
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import { fetchPokemonShinySpriteURL } from '$lib/functions/getPokemonSpritesURL';

	import TypesRelationship from './TypesRelationship.svelte';
	import { device } from '$lib/store/device';
	import PrevNextNavigation from '$lib/components/layout/PrevNextNavigation.svelte';

	export let id: number = 0;
	export let sprite: string = '';
	export let types: string[] = [];

	$: shinySprite = fetchPokemonShinySpriteURL(id);

	let toggleShiny: boolean = false;
	let toggleTypes: boolean = false;
	let toggleCover: boolean = false;
</script>

<section
	id="stats-main"
	in:fade={{ delay: 50 }}
	class:main={!toggleTypes}
	style:background={drawBookBackground(types, $device === 'mobile')}
>
	<header id="main-buttons">
		<Switch event="types" icon="pokedex" on:types={(e) => (toggleTypes = e.detail.types)} />
		{#if !toggleTypes}
			<Switch event="shiny" icon="shiny" on:shiny={(e) => (toggleShiny = e.detail.shiny)} />
		{:else}
			<Switch event="cover" icon="pokedex" on:cover={(e) => (toggleCover = e.detail.cover)} />
		{/if}
	</header>
	{#if !toggleTypes}
		{#if $device === 'mobile'}
			<div id="prev-next-nav">
				<PrevNextNavigation />
			</div>
		{/if}
		<figure class="main-image">
			<img
				src={!toggleShiny ? sprite : shinySprite}
				alt={sprite}
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
		overflow-y: auto;

		&::-webkit-scrollbar {
			display: none;
		}

		box-shadow: var(--box-shadow);

		&.main {
			grid-template: 8svh 2fr 1fr / 100%;
		}

		&:not(.main) {
			grid-template: 8svh auto / 100%;

			padding-block-end: 1rem;
		}

		& > #main-buttons {
			grid-area: 1/1;

			position: sticky;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-inline: 2em;
			height: 100%;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.35);
			backdrop-filter: blur(2px);
		}

		& .main-image {
			grid-area: 2/1;

			position: relative;
			&::after {
				content: '';
				position: absolute;
				bottom: -5%;
				left: calc(50% - 100%);
				height: 50%;
				width: 200%;
				border-radius: 50%;
				background-color: rgba(0, 0, 0, 0.2);
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
		}

		& > #main-types {
			grid-area: 3 / 1;
			display: flex;
			justify-content: space-between;
			padding-inline: 3em;
			gap: var(--normal-gap);
		}
	}

	@media (max-width: 640px) {
		#stats-main {
			position: absolute;
			inset: 0;
			overflow: auto;
			height: unset;

			border-radius: 0;
			box-shadow: none;
		}

		.main {
			grid-template: 5svh 2fr 1fr / 100% !important;
		}
	}
</style>
