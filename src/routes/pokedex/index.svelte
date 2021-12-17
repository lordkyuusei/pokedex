<script context="module">
	import {
		DEFAULT_OFFSET_INCREMENT,
		DEFAULT_POKEMON_OFFSET,
		MAX_POKEMON_LOADING
	} from '$lib/constants';

	export const load = async ({ page, fetch }) => {
		try {
			const [limit, offset] = [
				page.query.get('_limit') || MAX_POKEMON_LOADING,
				page.query.get('_offset') || DEFAULT_POKEMON_OFFSET
			];
			const result = await fetch(`/pokedex/pokedex.json?_limit=${limit}&_offset=${offset}`);

			if (result.ok) {
				const { pokemonBulk } = await result.json();
				const lightkedex = await import('$lib/store/lightkedex.json').then((codex) =>
					pokemonBulk.results.map((pokemon) => {
						const lightkemon = codex.default.find(
							(p) => `${p.id}` === pokemon.url.match(/\d+/g)[1]
						);
						return {
							id: lightkemon.id,
							name: lightkemon.name,
							nameId: pokemon.name,
							image: '',
							types: lightkemon.types
						};
					})
				);

				return {
					props: {
						pokemonBulk: lightkedex
					}
				};
			}
		} catch (error) {
			console.error('wot');
		}
	};
</script>

<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';

	import { pokedex } from '$lib/store/pokedex';
	import type { Lightkemon } from '$lib/types/Pokemon';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import { fetchPokemonSpriteURL } from '$lib/api';

	export let pokemonBulk: Lightkemon[] = [];

	let lastPokemon: string;
	let target: Element = null;

	$: if (target && browser) {
		stalker.observe(target);
	}

	$: if (pokemonBulk) {
		pokedex.update((pokedex) => [...pokedex, ...pokemonBulk]);
		lastPokemon = `#pokemon-${$pokedex.length - 1}`;
	}

	const callback = (entries: any[], observer: { unobserve: (arg0: any) => void }) => {
		const currentTarget = entries[0];
		if (currentTarget.isIntersecting) {
			observer.unobserve(currentTarget.target);
			const query = new URLSearchParams($page.query.toString());
			const _offset = `${
				(parseInt(query.get('_offset')) || DEFAULT_POKEMON_OFFSET) + DEFAULT_OFFSET_INCREMENT
			}`;
			query.set('_offset', _offset);
			goto(`?${query.toString()}`, { noscroll: true });
		}
	};

	let stalker: IntersectionObserver = browser
		? new IntersectionObserver(callback, {
				root: document.querySelector('#pokedex'),
				threshold: 1.0
		  })
		: null;

	onMount(() => {
		setTimeout(() => {
			const target = document.querySelector(lastPokemon);
			stalker.observe(target);
		}, 1000);

		return () => {
			stalker.disconnect();
			pokedex.set([]);
		};
	});

	afterUpdate(() => {
		target = document.querySelector(lastPokemon);
	});
</script>

<svelte:head>
	<title>Kyuudex</title>
</svelte:head>

<a href="/">Home</a>
<div class="pokedex" id="pokedex">
	{#each $pokedex as pokemon}
		<a href={`/pokemon/${pokemon?.id}`} id={`pokemon-${pokemon?.id}`}>
			<PokemonCard
				id={`${pokemon?.id}`}
				name={pokemon?.name}
				picture={fetchPokemonSpriteURL(`${pokemon?.id}`)}
				types={pokemon?.types}
			/>
		</a>
	{/each}
</div>

<style scoped>
	.pokedex {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}

	a {
		text-decoration: none;
	}
</style>
