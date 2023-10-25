<svelte:options immutable={true} />

<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	import { lang } from '$lib/store/lang';
	import type { PageServerData } from './$types';
	import { generation } from '$lib/store/generation';

	import Book from '$lib/components/common/Book.svelte';
	import { device } from '$lib/store/device';

	export let data: PageServerData;

	let target: Element;
	let observer: IntersectionObserver;

	$: interval = $device === 'desktop' ? 10 : $device === 'tablet' ? 5 : 3;

	$: leftBoundary = $generation?.boundaries.from;
	$: rightBoundary = $generation?.boundaries.to;

	$: if (browser) {
		goto(`/pokedex?from=${leftBoundary}&to=${leftBoundary + 42}`);
	}

	onMount(() => {
		observer = new IntersectionObserver(async (entries, observers) => {
			const { intersectionRatio, target } = entries[0];
			if (intersectionRatio > 0) {
				observer.unobserve(target);
				const currentTo = parseInt($page.url.searchParams.get('to'));
				if (currentTo < rightBoundary) {
					const nextTo = Math.min(parseInt(currentTo) + interval, rightBoundary + interval);
					await goto(`/pokedex?from=${leftBoundary}&to=${nextTo}`);
				} else if (currentTo > rightBoundary) {
					const nextTo = leftBoundary + 42;
					await goto(`/pokedex?from=${leftBoundary}&to=${nextTo}`);
				}
			}
		});
	});

	afterUpdate(() => {
		if (data.pokemonList.length) {
			const { id } = data.pokemonList[data.pokemonList.length - 1];
			target = document.querySelector(`#book-${id}`);
			observer.observe(target);
		}
	});
</script>

<section id="pokedex">
	{#each data.pokemonList as pokemon (pokemon._id)}
		<a href="/pokemon/{pokemon.id}" transition:fly|local>
			<Book id={pokemon.id} name={pokemon.i18n[$lang]} types={pokemon.types} />
			<span id="{pokemon.id}-shelf" />
		</a>
	{/each}
</section>

<style>
	#pokedex {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5em, 1fr));
		column-gap: 0.5em;
		row-gap: 2em;

		align-items: flex-end;
		width: 100%;
		height: 100%;
		padding-block: 1em;
		padding-inline: 4em;

		overflow-y: scroll;
		scroll-snap-type: y mandatory;
	}

	[id$='-shelf'] {
		display: block;
		width: calc(100% + 0.5em);
		transform: translateX(-0.25em);
		height: 1em;
		background-color: var(--background-accent);
	}

	@media (max-width: 640px) {
		#pokedex {
			padding-inline: 1em;
		}
	}
</style>
