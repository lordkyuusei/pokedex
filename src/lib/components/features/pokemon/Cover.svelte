<script lang="ts">
	import { fetchPokemonShinySpriteURL } from '$lib/api/fetch';
	import Type from '$lib/components/common/Type.svelte';

	import Switch from '$lib/components/common/Switch.svelte';
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import TypesRelationship from './TypesRelationship.svelte';
	import { fade } from 'svelte/transition';

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
	style:background={drawBookBackground(types)}
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
		{#if !toggleShiny}
			<img src={sprite} alt={sprite} />
		{:else}
			<img src={shinySprite} alt={sprite} on:error={(e) => (e.target.src = sprite)} />
		{/if}
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
		border-radius: var(--border-r-200);
		grid-row: 1;
		overflow: auto;

		box-shadow: var(--box-shadow);
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
		display: flex;
		justify-content: space-between;
		padding-inline: 2em;
		width: 100%;
	}

	img {
		transform: scale(1.5) translateY(-0.5em);
		image-rendering: pixelated;
	}

	#main-types {
		display: flex;
		justify-content: space-between;
		padding-inline: 2em;
		gap: var(--normal-gap);
	}
</style>
