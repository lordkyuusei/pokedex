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
			const name = v.pokemon.name.split('-')[1] || v.pokemon.name;

			return {
				id,
				name,
				isDefault: v.is_default
			};
		});
</script>

<Card transparent={true}>
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
					{variety.isDefault ? $t('variety.default') : ''}
				</a>
			{/each}
		</section>
	{/if}
</Card>

<style>
	.pokemon-varieties {
		display: flex;
		justify-content: flex-start;
		gap: 1em;
		height: 100%;
		overflow-x: auto;
	}

	.variety-element {
		display: flex;
		height: 3em;
		padding-inline: 0.5em;
		place-items: center;
		border-radius: var(--theme-border-r);
		text-transform: capitalize;
	}

	.variety-element img {
		max-width: 3em;
	}

	.variety-element.selected {
		background-color: var(--theme-text);
		color: var(--theme-background);
		transition: 0.2s ease-in-out;
	}

	.variety-element:not(.selected, :hover) {
		filter: grayscale(1);
		background-color: var(--theme-alt-background);
	}

	.variety-element:hover {
		background-color: var(--theme-secondary);
		color: var(--theme-background);
		transition: 0.2s ease-in-out;
	}
</style>
