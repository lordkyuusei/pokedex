<script lang="ts">
	import Switch from '$lib/components/fragments/Switch.svelte';
	import type { FactoryPokemon } from '$lib/types/battle-factory';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let pokemon: FactoryPokemon;
	export let isLvl100Mode: boolean = false;

	let dispatch = createEventDispatcher();

	$: stats = pokemon[isLvl100Mode ? 'lv100Stats' : 'lv50Stats'];
	$: evs = pokemon['evs'];
</script>

<details class="pokemon-card" bind:open>
	<summary class="card-title">
		<span class="name">
			{pokemon.name} / {pokemon.variant}
		</span>
		<span class="nature">
			{pokemon.nature}
		</span>
		<span class="ability">
			{pokemon.ability}
		</span>
		<span class="item">
			{pokemon.item}
		</span>
		<span class="star">
			<button
				class="small round"
				class:star={pokemon.meta.isStarred}
				on:click={() => dispatch('star', pokemon.id)}>⭐</button
			>
		</span>
		<span class="icon">🔻</span>
	</summary>
	<table class="card-moves">
		<thead>
			<tr>
				<th></th>
				<th>Capacité 1</th>
				<th>Capacité 2</th>
				<th>Capacité 3</th>
				<th>Capacité 4</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td></td>
				<td>{pokemon['1stMove']}</td>
				<td>{pokemon['2ndMove']}</td>
				<td>{pokemon['3rdMove']}</td>
				<td>{pokemon['4thMove']}</td>
				<td></td>
			</tr>
		</tbody>
	</table>
	<table class="card-stats">
		<thead>
			<tr>
				<th>PV</th>
				<th>Attaque</th>
				<th>Défense</th>
				<th>Attaque Spé.</th>
				<th>Défense Spé.</th>
				<th>Vitesse</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				{#each stats as stat, i}
					<td class:up={evs[i] >= 170}>{stat} ({evs[i]})</td>
				{/each}
			</tr>
		</tbody>
	</table>
</details>

<style>
	details.pokemon-card {
		box-shadow: var(--box-shadow);
		background-color: var(--background-second-color);
		border: 1px solid var(--text-color);

		&[open] > summary > span:last-child {
			transform: rotate(180deg);
			transform-origin: center;
		}

		& > summary {
			display: grid;
			grid-template: 'name nature ability item . star icon' 100% / 1fr 1fr 1.5fr 1fr 5fr auto auto;
			align-items: center;
			gap: var(--smaller-gap);
			padding: var(--smaller-gap) var(--small-gap);
			background-color: var(--background-color);
			transition: background-color var(--transition-duration) var(--transition-function);

			@media (max-width: 640px) {
				grid-template: 'name nature ability item star icon' 100% / 1fr 1fr 1fr 1fr auto auto;
			}
			& > * {
				grid-row: 1;
			}

			& > span {
				width: 100%;

				&:last-child {
					scale: 2;
					text-align: end;
					transition: transform var(--transition-duration) var(--transition-function);
				}

				&.name {
					grid-area: name;
					text-align: justify;
				}
				&.nature {
					grid-area: nature;
				}
				&.ability {
					grid-area: ability;
				}
				&.item {
					grid-area: item;
				}
				&.star {
					grid-area: star;

					& > button:not(.star) {
						filter: grayscale(0.8);
					}
				}
				&.icon {
					grid-area: icon;
				}
			}

			&:hover {
				cursor: pointer;
				background-color: var(--background-blur-color);
			}
		}

		& > table {
			& .up {
				color: var(--second-color);
			}

		}
	}
</style>
