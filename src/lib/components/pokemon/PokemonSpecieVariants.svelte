<script lang="ts">
	import type { VarietyRef } from '$lib/types/PokemonSpecie';
	import Card from '../barebone/Card.svelte';
	import { t } from '$lib/store/i18n/i18n';
	import { fetchPokemonSpriteURL } from '$lib/api';

	export let id: string;
	export let varieties: VarietyRef[] = [];

	$: pokemonVarieties = extractVarieties(varieties);

	const extractVarieties = (varieties: VarietyRef[]) =>
		varieties.map((v) => {
			const id = v.pokemon.url.match(/\d+/g).pop();
			return {
				id,
				name: v.pokemon.name
			};
		});
</script>

<Card title={$t('title.forms-varieties')}>
	{#if pokemonVarieties.length}
		<section class="pokemon-varieties">
			{#each pokemonVarieties as variety}
				<a
					class="variety-element"
					class:selected={id === variety.id}
					href={`/pokemon/${variety.id}`}
				>
					<img src={fetchPokemonSpriteURL(variety.id)} alt={variety.name} />
					{variety.name}
				</a>
			{/each}
		</section>
	{/if}
</Card>

<style>
	.pokemon-varieties {
		display: flex;
		height: 100%;
		overflow-x: auto;
	}

	.variety-element {
		display: flex;
		height: 3em;
		flex: 1 0 auto;
		padding-inline: 0.5em;
		place-items: center;
	}

	.variety-element:first-of-type {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
	}

	.variety-element:last-of-type {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.variety-element img {
		max-width: 3em;
	}

	.variety-element.selected {
		background-color: var(--theme-text);
		color: var(--theme-background);
		transition: 0.2s ease-in-out;
	}

	.variety-element:hover {
		background-color: var(--theme-secondary);
		color: var(--theme-background);
		transition: 0.2s ease-in-out;
	}
</style>
