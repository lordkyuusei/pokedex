<script lang="ts">
	import { fade } from 'svelte/transition';

	import Type from '$lib/components/common/Type.svelte';
	import Switch from '$lib/components/common/Switch.svelte';
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import { fetchPokemonShinySpriteURL } from '$lib/functions/getPokemonSpritesURL';

	import TypesRelationship from './TypesRelationship.svelte';
	import { device } from '$lib/store/device';

	export let sprite: string = '';
	export let id: number = 0;
	export let types: string[] = [];

	$: shinySprite = fetchPokemonShinySpriteURL(id);

	let toggleShiny: boolean = false;
	let toggleTypes: boolean = false;
	let toggleCover: boolean = false;
</script>

<section
	in:fade={{ delay: 50 }}
	id="stats-main"
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
		<div class="main-image">
			{#if !toggleShiny}
				<img src={sprite} alt={sprite} />
			{:else}
				<img src={shinySprite} alt={sprite} on:error={(e) => (e.target.src = sprite)} />
			{/if}
		</div>
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
		border-radius: var(--border-r-50) var(--border-r-200) 0 var(--border-r-200);
		overflow: auto;

		box-shadow: var(--box-shadow);
	}

	@media (max-width: 414px) {
		#stats-main {
			border-radius: 0;
			box-shadow: none;
		}
	}

	#stats-main.main {
		grid-template:
			'buttons' 1fr
			'pokemon-sprite' 1fr
			'typings' 1fr / 100%;
	}

	#stats-main:not(.main) {
		grid-template:
			'buttons' 6em
			'pokemon-types' auto / 100%;
	}

	#main-buttons {
		grid-area: buttons;
		display: flex;
		justify-content: space-between;
		padding-inline: 2em;
		width: 100%;
	}

	.main-image {
		position: relative;
		grid-area: pokemon-sprite;
	}

	.main-image::after {
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

	.main-image > img {
		position: relative;
		transform: scale(1.5) translateY(-0.5em);
		image-rendering: pixelated;
		z-index: 1;
	}

	#main-types {
		grid-area: typings;
		display: flex;
		justify-content: space-between;
		padding-inline: 3em;
		gap: var(--normal-gap);
	}
</style>
