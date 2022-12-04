<script lang="ts">
	import type { AbilityRef, EntityRef } from '$lib/types/Pokemon';
	import type { PokemonAbility } from '$lib/types/PokemonAbility';

	import Card from '../barebone/Card.svelte';

	import { fetchPokemonAbility } from '$lib/api';
	import { locale, t } from '$lib/store/i18n/i18n';

	export let abilities: AbilityRef[] = [];

	let abilityChosen: number = 1;
	$: abilityDetails = fetchAbilityDetails(
		abilities.find((ability) => ability.slot === abilityChosen)
	);

	const fetchAbilityDetails = async ({ ability }: { slot: number; ability: EntityRef }) => {
		const id = ability.url.match(/\d+/g).pop();
		return fetchPokemonAbility(id);
	};

	const getAbilityName = (abilityDetails: PokemonAbility) =>
		abilityDetails.names.find((name) => name.language.name === $locale.slice(0, 2)).name;

	const getAbilityDetails = (abilityDetails: PokemonAbility) =>
		abilityDetails.flavor_text_entries.find((entry) => entry.language.name === $locale.slice(0, 2))
			.flavor_text;
</script>

<Card title={$t('title.abilities')}>
	<div class="pokemon-abilities-list">
		{#each abilities as ability}
			<button
				class="ability-button"
				class:hidden={ability.is_hidden}
				class:chosen={abilityChosen === ability.slot}
				on:click={() => (abilityChosen = ability.slot)}
			>
				{ability.ability.name}
			</button>
		{/each}
	</div>
	<pre class="pokemon-ability-details">
        {#await abilityDetails}
			...
		{:then details}
			{getAbilityDetails(details)}
		{/await}
    </pre>
</Card>

<style>
	.pokemon-abilities-list {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		width: 100%;
		overflow-x: auto;
		border-radius: 10px 10px 0 0;
	}

	.ability-button {
		font: inherit;
		border-width: 0 0 1px 0;
		background-color: var(--theme-background);
		color: var(--theme-text);
		border-color: var(--theme-text);
		cursor: pointer;
		width: 100%;
		transition: 0.2s;
		white-space: nowrap;
		text-transform: capitalize;
	}

	.ability-button:hover {
		color: var(--theme-background);
		background-color: var(--theme-text);
	}

	.hidden {
		font-style: italic;
	}

	.hidden::before {
		content: '* ';
	}

	.chosen {
		background-color: var(--theme-secondary);
		color: var(--theme-background);
	}

	.ability-button:first-child {
		border-radius: 10px 0 0 0;
		border-width: 0 1px 1px 0;
	}

	.ability-button:last-child {
		border-radius: 0 10px 0 0;
		border-width: 0 0 1px 1px;
	}

	.ability-button:only-child {
		border-radius: 10px 10px 0 0;
		border-width: 0 0 1px 0;
	}

	.pokemon-ability-details {
		white-space: normal;
		margin: 0.5em 0;
		padding: 0 1em;
	}
</style>
