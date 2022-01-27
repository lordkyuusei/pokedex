<script lang="ts">
	import { onMount } from 'svelte';
	import type { PokemonForm } from '$lib/types/PokemonForm';
	import type { VarietyRef } from '$lib/types/PokemonSpecie';
	import type { EntityRef, Pokemon } from '$lib/types/Pokemon';

	import PokemonCard from '../PokemonCard.svelte';
	import Card from '../PokemonLayouts/Card.svelte';

	import { t } from '$lib/store/i18n/i18n';
	import { fetchPokemonForm, fetchPokemonInfo } from '$lib/api';

	export let forms: EntityRef[] = [];
	export let varieties: VarietyRef[] = [];

	let pokemonVarieties: Pokemon[] = [];
	let pokemonForms: PokemonForm[] = [];

	const spanCalculation = () => {
		if (pokemonForms.length === 1 || pokemonVarieties.length === 1) {
			return 'sm';
		} else if (pokemonForms.length === 2 || pokemonVarieties.length === 2) {
			return 'md';
		} else if (pokemonForms.length === 3 || pokemonVarieties.length === 3) {
			return 'lg';
		} else {
			return 'xl';
		}
	};

	onMount(async () => {
		if (varieties.length > 1) {
			const pokemonPromises = varieties.map((variety) => {
				const pokemon = fetchPokemonInfo(variety.pokemon.name);
				return pokemon;
			});
			pokemonVarieties = await Promise.all(pokemonPromises);
		}
		if (forms.length > 1) {
			const pokemonPromises = forms.map((form) => {
				const formId = form.url.match(/\d+/g).pop();
				const pokemon = fetchPokemonForm(formId);
				return pokemon;
			});
			pokemonForms = await Promise.all(pokemonPromises);
		}

		return () => {
			pokemonVarieties = [];
			pokemonForms = [];
		};
	});
</script>

<Card title={$t('title.forms-varieties')} span={spanCalculation()} size="lg" close_up>
	{#if pokemonVarieties.length}
		<div class="pokemon-varieties">
			{#each pokemonVarieties as variety}
				<a href={`/pokemon/${variety.id}`}>
					<PokemonCard
						id={`${variety.id}`}
						name={variety.name}
						types={variety.types.map((type) => type.type.name)}
						isLink
					/>
				</a>
			{/each}
		</div>
	{/if}
	{#if pokemonForms.length}
		<div class="pokemon-forms">
			{#each pokemonForms as form}
				<a href={`/pokemon/${form.id}`}>
					<PokemonCard
						id={`${form.id}`}
						name={form.name}
						types={form.types?.map((type) => type.type.name)}
						picture={form.sprites?.front_default}
					/>
				</a>
			{/each}
		</div>
	{/if}
</Card>

<style>
	.pokemon-varieties,
	.pokemon-forms {
		display: flex;
		align-items: center;
		overflow-x: auto;
		height: 100%;
	}

	a {
		height: calc(100% - 1rem);
		width: 50%;
	}
</style>
