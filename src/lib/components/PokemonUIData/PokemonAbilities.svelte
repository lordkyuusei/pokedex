<script lang="ts">
	import { onMount } from 'svelte';

	import type { AbilityRef, EntityRef } from '$lib/types/Pokemon';
	import type { PokemonAbility } from '$lib/types/PokemonAbility';

	import Card from '../PokemonLayouts/Card.svelte';

	import { fetchPokemonAbility } from '$lib/api';
	import { locale, t } from '$lib/store/i18n/i18n';

	export let abilities: AbilityRef[] = [];
	let abilityChosen: number = 1;
	let abilityDetails: PokemonAbility;

	const fetchAbilityDetails = async ({ slot, ability }: { slot: number; ability: EntityRef }) => {
		abilityChosen = slot;
		const id = ability.url.match(/\d+/g).pop();
		fetchPokemonAbility(id).then((ability) => {
			abilityDetails = ability;
		});
	};

	const getAbilityName = (abilityDetails: PokemonAbility) =>
		abilityDetails.names.find((name) => name.language.name === $locale.slice(0, 2)).name;

	const getAbilityDetails = (abilityDetails: PokemonAbility) =>
		abilityDetails.flavor_text_entries.find((entry) => entry.language.name === $locale.slice(0, 2))
			.flavor_text;

	onMount(async () => {
		if (abilities[0]) {
			await fetchAbilityDetails(abilities[0]);
		}
	});
</script>

<Card title={$t('title.abilities')} span="md" size="xs">
	<div class="pokemon-abilities-list">
		{#each abilities as ability}
			<button
				class="ability-button"
				class:hidden={ability.is_hidden}
				class:chosen={abilityChosen === ability.slot}
				on:click={() => fetchAbilityDetails(ability)}
			>
				{ability.ability.name}
			</button>
		{/each}
	</div>
	<pre class="pokemon-ability-details">
        {#if abilityDetails}
			{getAbilityDetails(abilityDetails)}
		{:else}
			Click on any ability to get its description.
		{/if}
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
		padding: 0 1rem;
	}
</style>
