<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { afterUpdate, onMount } from 'svelte';

	import { pokedex } from '$lib/store/pokedex';
	import { fetchPokemonSpriteURL } from '$lib/api';
	import type { Lightkemon } from '$lib/types/Pokemon';
	import type { PageData } from './$types';
	import {
		DEFAULT_OFFSET_INCREMENT,
		DEFAULT_POKEMON_OFFSET,
		GENERATION_BOUNDARIES
	} from '$lib/constants';

	import Button from '$lib/components/barebone/Button.svelte';
	import PokemonCard from '$lib/components/pokemon/PokemonCard.svelte';

	export let data: PageData;

	let lastPokemon: string;
	let target: Element = null;
	const intersectionOptions: IntersectionObserverInit = {};

	$: handleUpdate(data.pokemonBulk);

	const handleUpdate = (pokemonBulk: Lightkemon[]) => {
		pokedex.update((pokedex) => [...pokedex, ...pokemonBulk]);
		try {
			lastPokemon = `#pokemon-${$pokedex.at(-1)?.id}`;
		} catch (err) {
			lastPokemon = `#pokemon-${$pokedex[$pokedex.length - 1].id}`;
		}
	};

	const handleNewBoundaries = (start: number, end: number) => {
		pokedex.update(() => []);
		goto(`?_offset=${start}&_limit=${end - start}`);
	};

	const handleIntersection = (entries: any[], observer: { unobserve: (arg0: any) => void }) => {
		if (entries[0].isIntersecting) {
			observer.unobserve(entries[0].target);
			const query = new URLSearchParams($page.url.searchParams.toString());
			query.set(
				'_offset',
				`${(parseInt(query.get('_offset')) || DEFAULT_POKEMON_OFFSET) + DEFAULT_OFFSET_INCREMENT}`
			);
			goto(`?${query.toString()}`, { noScroll: true });
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
	<meta name="description" content="Kyuudex list" />
</svelte:head>

<header class="pokedex-shortcuts">
	{#each GENERATION_BOUNDARIES as { start, end }, index}
		<Button size="lg" on:click={() => handleNewBoundaries(start, end)}>
			Gen.&nbsp;{index + 1} <br />({start}&nbsp;-&nbsp;{end})
		</Button>
	{/each}
</header>
<section class="pokedex" id="pokedex">
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
</section>

<style>
	.pokedex-shortcuts {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		width: 100%;
	}

	.pokedex {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		grid-auto-rows: 20em;
		justify-content: center;
		gap: 1rem;
	}

	.pokedex > a {
		display: flex;
	}

	@media screen and (min-width: 320px) and (max-width: 425px) {
		.pokedex {
			flex-direction: column;
		}

		.pokedex-shortcuts {
			flex-wrap: nowrap;
			overflow-x: auto;
			justify-content: flex-start;
		}
	}
</style>
