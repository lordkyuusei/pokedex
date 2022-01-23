<script context="module" lang="ts">
	import {
		DEFAULT_OFFSET_INCREMENT,
		DEFAULT_POKEMON_OFFSET,
		MAX_POKEMON_LOADING
	} from '$lib/constants';
	import codex from '$lib/store/lightkedex.json';

	export const load = async ({ url, fetch }) => {
		try {
			const [limit, offset] = [
				url.searchParams.get('_limit') || MAX_POKEMON_LOADING,
				url.searchParams.get('_offset') || DEFAULT_POKEMON_OFFSET
			];
			const result = await fetch(`/pokedex/pokedex.json?_limit=${limit}&_offset=${offset}`);

			if (result.ok) {
				const { pokemonBulk }: { pokemonBulk: PokemonBulk } = await result.json();
				const lightkedex = pokemonBulk.results.map((pokemon: EntityRef) => {
					const lightkemon = codex.find((p) => `${p.id}` === pokemon.url.match(/\d+/g)[1]);
					return {
						id: lightkemon.id,
						name: lightkemon.name,
						image: '',
						types: lightkemon.types
					};
				});

				return {
					props: {
						pokemonBulk: lightkedex
					}
				};
			}
		} catch (error) {
			return {
				props: {
					pokemonBulk: []
				}
			};
		}
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { afterUpdate, onMount } from 'svelte';

	import { pokedex } from '$lib/store/pokedex';
	import { fetchPokemonSpriteURL } from '$lib/api';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import type { EntityRef, Lightkemon, PokemonBulk } from '$lib/types/Pokemon';

	export let pokemonBulk: Lightkemon[] = [];

	let lastPokemon: string;
	let target: Element = null;
	const intersectionOptions: IntersectionObserverInit = {};

	$: if (pokemonBulk) {
		pokedex.update((pokedex) => [...pokedex, ...pokemonBulk]);
		try {
			lastPokemon = `#pokemon-${$pokedex.at(-1)?.id}`;
		} catch (err) {
			console.error(`is this safari again??? ${err}`);
			lastPokemon = `#pokemon-${$pokedex[$pokedex.length - 1].id}`;
		}
	}

	const handleIntersection = (entries: any[], observer: { unobserve: (arg0: any) => void }) => {
		if (entries[0].isIntersecting) {
			observer.unobserve(entries[0].target);
			const query = new URLSearchParams($page.url.searchParams.toString());
			query.set(
				'_offset',
				`${(parseInt(query.get('_offset')) || DEFAULT_POKEMON_OFFSET) + DEFAULT_OFFSET_INCREMENT}`
			);
			goto(`?${query.toString()}`, { noscroll: true });
		}
	};

	let stalker: IntersectionObserver = browser
		? new IntersectionObserver(handleIntersection, intersectionOptions)
		: null;

	onMount(() => {
		intersectionOptions.root = document.querySelector('#pokedex');
		intersectionOptions.threshold = 1.0;
		target = document?.querySelector(lastPokemon);

		return () => {
			stalker.disconnect();
			pokedex.set([]);
		};
	});

	afterUpdate(() => {
		if (browser) {
			target = document.querySelector(lastPokemon);
			if (target) {
				stalker.observe(target);
			}
		}
	});
</script>

<svelte:head>
	<title>Kyuudex</title>
</svelte:head>

<div class="pokedex" id="pokedex">
	{#each $pokedex as pokemon}
		<a href={`/pokemon/${pokemon?.id}`} id={`pokemon-${pokemon?.id}`}>
			<PokemonCard
				id={`${pokemon?.id}`}
				name={pokemon?.name}
				picture={fetchPokemonSpriteURL(`${pokemon?.id}`)}
				types={pokemon?.types}
				isLink
			/>
		</a>
	{/each}
</div>

<style>
	.pokedex {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}

	@media screen and (min-width: 320px) and (max-width: 425px) {
		.pokedex {
			flex-direction: column;
		}

		a {
			width: 95%;
		}
	}

	@media screen and (min-width: 425px) and (max-width: 768px) {
		a {
			width: calc(50% - 0.5rem);
		}
	}

	@media screen and (min-width: 768px) and (max-width: 1024px) {
		a {
			width: calc(33% - 0.5rem);
		}
	}

	@media screen and (min-width: 1024px) {
		a {
			width: calc(25% - 0.5rem);
		}
	}
</style>
