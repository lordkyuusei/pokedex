<script lang="ts">
	import { onMount } from 'svelte';
	import type { PokemonForm } from '$lib/types/PokemonForm';
	import type { EntityRef, Pokemon } from '$lib/types/Pokemon';

	import PokemonCard from './PokemonCard.svelte';
	import Card from '../barebone/Card.svelte';

	import { t } from '$lib/store/i18n/i18n';
	import { fetchPokemonForm, fetchPokemonInfo } from '$lib/api';

	export let forms: EntityRef[] = [];

	let pokemonForms: PokemonForm[] = [];

	onMount(async () => {
		if (forms.length > 1) {
			const pokemonPromises = forms.map((form) => {
				const formId = form.url.match(/\d+/g).pop();
				const pokemon = fetchPokemonForm(formId);
				return pokemon;
			});
			pokemonForms = await Promise.all(pokemonPromises);
		}

		return () => {
			pokemonForms = [];
		};
	});
</script>

<Card title={$t('title.forms-varieties')} close_up>
	{#if pokemonForms.length}
		<h1>Formes</h1>
		<section class="pokemon-forms">
			{#each pokemonForms as form}
				<a class="form-element" href={`/pokemon/${form.id}`}>
					<PokemonCard
						id={`${form.id}`}
						name={form.name}
						types={form.types?.map((type) => type.type.name)}
						picture={form.sprites?.front_default}
					/>
				</a>
			{/each}
		</section>
	{/if}
</Card>

<style>
	.pokemon-forms {
		display: flex;
		align-items: center;
		overflow-x: auto;
		height: 100%;
		gap: 1em;
	}

	.form-element {
		height: calc(100% - 1em);
		width: 100vw;
	}
</style>
