<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchPokemonSpriteURL } from '$lib/api';
	import { goto } from '$app/navigation';

	export let stage: number = 1;
	export let maxStage: number;
	export let pokemon: string = '';

	$: spriteURL = fetchPokemonSpriteURL(pokemon, 'versions', 'generation-viii', 'icons');
</script>

<div class="pokemon-link">
	{#if stage !== 1}
		<div class="link link-before" />
	{/if}

	<div class="link-picture">
		<img
			src={spriteURL}
			alt={pokemon}
			on:click={() => goto(`/pokemon/${pokemon}`, { noscroll: true })}
		/>
	</div>

	{#if stage !== maxStage}
		<div class="link link-after" />
	{/if}
</div>

<style>
	.pokemon-link {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 100%;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.link {
		height: 0px;
		border-width: 5px;
		border-style: solid;
	}

	.link-before {
		grid-column: 1;
		width: 50%;
		border-top-right-radius: 25px;
		border-bottom-right-radius: 25px;
	}

	.link-picture {
		grid-column: 2;
		align-self: center;
		cursor: pointer;
		border-radius: 25px;
		display: flex;
		flex-wrap: nowrap;
		align-content: center;
		justify-content: center;
	}

	.link-picture img {
		margin-bottom: 2rem;
		image-rendering: pixelated;
	}

	.link-after {
		grid-column: 3;
		border-top-left-radius: 25px;
		border-bottom-left-radius: 25px;
	}
</style>
