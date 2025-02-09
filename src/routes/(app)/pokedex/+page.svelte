<svelte:options immutable={true} />

<script lang="ts">
	import { afterUpdate, onDestroy, onMount } from 'svelte';

	import { browser } from '$app/environment';

	import { lang } from '$lib/store/lang';
	import { version } from '$lib/store/generation';
	import { deviceWidth } from '$lib/store/device';
	import { generation } from '$lib/store/generation';
	import type { Lightkemon } from '$lib/types/lightkemon';
	import Book from '$lib/components/fragments/Book.svelte';
	import Switch from '$lib/components/fragments/Switch.svelte';
	import { DEFAULT_LEFT_BOUNDARY, DEFAULT_RIGHT_BOUNDARY } from '$lib/constants/global';

	let currentTo: number = 0;
	let ref: HTMLSpanElement;
	let target: HTMLSpanElement;
	let observer: IntersectionObserver;
	let isRegionalMode: boolean = false;
	let pokemonList: Promise<Lightkemon[]>;

	$: interval = Math.ceil($deviceWidth / 125);
	$: leftBoundary = $generation?.boundaries.from;
	$: rightBoundary = $generation?.boundaries.to;

	$: pokemonList = onGenerationChange(leftBoundary, isRegionalMode);

	const fetchPokemonRange = async (left: number, right: number, isRegionalMode: boolean) => {
		const result = await fetch(
			`/api/pokedex?from=${left}&to=${right}${isRegionalMode ? '&game=' + $version : ''}`
		);
		const json = await result.json()
		console.log(json.length)
		return json;
	};

	const onGenerationChange = async (leftBoundary: number, isRegionalMode: boolean) => {
		if (!browser)
			return await fetchPokemonRange(DEFAULT_LEFT_BOUNDARY, DEFAULT_RIGHT_BOUNDARY, isRegionalMode);

		return await fetchPokemonRange(leftBoundary, leftBoundary + interval, isRegionalMode);
	};

	onMount(() => {
		observer = new IntersectionObserver(async (entries, _) => {
			const { intersectionRatio, target } = entries[0];
			if (intersectionRatio > 0) {
				observer.unobserve(target);

				if (leftBoundary >= currentTo) {
					currentTo = leftBoundary + interval;
				} else if (currentTo + interval <= rightBoundary) {
					currentTo = Math.min(currentTo + interval, rightBoundary + interval);
				} else {
					currentTo = rightBoundary;
				}

				pokemonList = await fetchPokemonRange(leftBoundary, currentTo, isRegionalMode);
			}
		});
	});

	afterUpdate(async () => {
		if (ref) {
			target = ref;
			observer.observe(target);
		}
	});

	onDestroy(() => {
		observer?.disconnect();
	});

	const switchMode = ({ detail }: { detail: boolean }) => {
		leftBoundary = detail ? 0 : $generation?.boundaries.from;
		currentTo = 0;
		isRegionalMode = detail;
	};
</script>

<section id="pokedex" class="cover">
	<header>
		<Switch icon="pokedex" event="nationalMode" on:nationalMode={switchMode}></Switch>
	</header>
	{#await pokemonList then pokemons}
		<ul>
			{#each pokemons as pokemon, index (pokemon.id)}
				<li>
					{#if index + 1 === pokemons.length}
						<a href="/pokemon/{pokemon.id}/stats">
							<Book id={pokemon.id} name={pokemon.i18n[$lang]} types={pokemon.types} />
							<span bind:this={ref} id="{pokemon.id}-shelf"></span>
						</a>
					{:else}
						<a href="/pokemon/{pokemon.id}/stats">
							<Book id={pokemon.id} name={pokemon.i18n[$lang]} types={pokemon.types} />
							<span id="{pokemon.id}-shelf" />
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	{/await}
</section>

<style>
	#pokedex {
		scroll-snap-type: y mandatory;

		& > header {
			position: sticky;
			top: 0;
			z-index: 2;

			display: flex;
			justify-content: end;
			padding: var(--small-gap);
			border-bottom: 1px solid var(--text-color);
			background-color: var(--background-second-color);
		}

		& > ul {
			display: flex;
			flex-wrap: wrap;
			justify-content: start;
			gap: var(--normal-gap) var(--smaller-gap);
			padding: var(--normal-gap);
			
			@media (max-width: 640px) {
				padding: var(--small-gap);
			}

			& > li {
				margin-top: auto;
				
				& > a {
					perspective: 1000px;
					
					&:hover {
						background: none;
					}
					
					& > [id$='-shelf'] {
						display: block;
						height: var(--small-gap);
						width: calc(100% + var(--smaller-gap) * 2);
						transform: translateX(calc(var(--smaller-gap) * -1));
						background-color: var(--text-color);
						scroll-snap-align: end;
						scroll-margin-block-end: var(--small-gap);
					}
				}
			}
		}
	}
</style>
