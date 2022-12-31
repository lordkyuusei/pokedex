<script lang="ts">
	import { onMount } from 'svelte';
	import type { PokemonForm } from '$lib/types/PokemonForm';
	import type { EntityRef, Pokemon } from '$lib/types/Pokemon';

	import PokemonCard from './PokemonCard.svelte';
	import Card from '../barebone/Card.svelte';

	import { t } from '$lib/store/i18n/i18n';
	import { fetchPokemonForm, fetchPokemonInfo } from '$lib/api';

	export let forms: EntityRef[] = [];

	$: pokemonForms = fetchPokemonForms(forms);

	const fetchPokemonForms = async (pkmnForms: EntityRef[]) =>
		pkmnForms.length > 1
			? await Promise.all(
					forms.map((form) => {
						const formId = form.url.match(/\d+/g).pop();
						const pokemon = fetchPokemonForm(formId);
						return pokemon;
					})
			  )
			: [];
</script>

{#await pokemonForms}
	<Card title={$t('title.forms-varieties')} />
{:then forms}
	{#if forms.length > 1}
		<Card title={$t('title.forms-varieties')}>
			<section class="pokemon-forms">
				{#each forms as form}
					<a class="form-element" href={`/pokemon/${form.id}`}>
						<img src={form.sprites?.front_default} alt={form.name} />
						{form.types?.map((type) => type.type.name)}
					</a>
				{/each}
			</section>
		</Card>
	{/if}
{/await}

<style>
	.pokemon-forms {
		display: flex;
		align-items: center;
		overflow-x: auto;
		gap: 1em;
	}

	.form-element {
		text-align: center;
		height: calc(100% - 1em);
		width: 100vw;
	}
</style>
