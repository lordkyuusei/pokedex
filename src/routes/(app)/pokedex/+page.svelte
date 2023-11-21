<svelte:options immutable={true} />

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { afterUpdate, onDestroy, onMount } from 'svelte';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	import { lang } from '$lib/store/lang';
	import type { PageServerData } from './$types';
	import { generation } from '$lib/store/generation';

	import Book from '$lib/components/common/Book.svelte';
	import { deviceWidth } from '$lib/store/device';
	import { DEFAULT_LEFT_BOUNDARY } from '$lib/constants/global';

	export let data: PageServerData;

	let ref: Element;
	let target: Element;
	let observer: IntersectionObserver;

	$: interval = Math.ceil($deviceWidth / 125);

	$: leftBoundary = $generation?.boundaries.from;
	$: rightBoundary = $generation?.boundaries.to;

	$: navigateOnGenerationChange(leftBoundary);

	const navigateOnGenerationChange = async (leftBoundary: number) =>
		browser && (await goto(`/pokedex?from=${leftBoundary}&to=${leftBoundary + interval}`));

	onMount(() => {
		observer = new IntersectionObserver(async (entries, _) => {
			const { intersectionRatio, target } = entries[0];
			if (intersectionRatio > 0) {
				observer.unobserve(target);

				const currentTo = parseInt($page.url.searchParams.get('to') ?? DEFAULT_LEFT_BOUNDARY);
				if (leftBoundary >= currentTo) {
					await goto(`/pokedex?from=${leftBoundary}&to=${leftBoundary + interval}`);
				} else if (currentTo + interval <= rightBoundary) {
					const nextTo = Math.min(currentTo + interval, rightBoundary + interval);
					await goto(`/pokedex?from=${leftBoundary}&to=${nextTo}`);
				} else {
					await goto(`/pokedex?from=${leftBoundary}&to=${rightBoundary}`);
				}
			}
		});
	});

	afterUpdate(async () => {
		if (data.pokemonList.length && ref) {
			target = ref;
			observer.observe(target);
		}
	});

	onDestroy(() => {
		observer?.disconnect();
	});
</script>

<section id="pokedex">
	{#each data.pokemonList as pokemon, index (pokemon._id)}
		<a href="/pokemon/{pokemon.id}/stats" transition:fly|local>
			<Book id={pokemon.id} name={pokemon.i18n[$lang]} types={pokemon.types} />
			{#if index + 1 === data.pokemonList.length}
				<span bind:this={ref} id="{pokemon.id}-shelf" />
			{:else}
				<span id="{pokemon.id}-shelf" />
			{/if}
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
		padding: 1em 1.5rem;

		overflow-y: scroll;
		scroll-snap-type: y mandatory;
	}

	[id$='-shelf'] {
		display: block;
		width: calc(100% + 0.5em);
		transform: translateX(-0.25em);
		height: 1em;
		background-color: var(--background-color-__);
	}

	@media (max-width: 640px) {
		#pokedex {
			padding-inline: 1em;
		}
	}
</style>
