<script lang="ts">
	import Switch from '$lib/components/common/Switch.svelte';
	import type { FactoryPokemon } from '$lib/types/battle-factory';
	import { createEventDispatcher } from 'svelte';

	export let pokemon: FactoryPokemon;
	export let isLvl100Mode: boolean = false;

	let dispatch = createEventDispatcher();

	$: stats = pokemon[isLvl100Mode ? 'lv100Stats' : 'lv50Stats'].split('/');
	$: evs = pokemon['evs'].split('/');
</script>

<details class="pokemon-card">
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
				<th>Capacité 1</th>
				<th>Capacité 2</th>
				<th>Capacité 3</th>
				<th>Capacité 4</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>{pokemon['1stMove']}</td>
				<td>{pokemon['2ndMove']}</td>
				<td>{pokemon['3rdMove']}</td>
				<td>{pokemon['4thMove']}</td>
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
				<td>{stats[0]} ({evs[0]})</td>
				<td>{stats[1]} ({evs[1]})</td>
				<td>{stats[2]} ({evs[2]})</td>
				<td>{stats[3]} ({evs[3]})</td>
				<td>{stats[4]} ({evs[4]})</td>
				<td>{stats[5]} ({evs[5]})</td>
			</tr>
		</tbody>
	</table>
</details>

<style>
	details.pokemon-card {
		padding: var(--smaller-gap);
		background-color: var(--background-second-color);

		&[open] > summary > span:last-child {
			transform: rotate(180deg);
			transform-origin: center;
		}

		& > summary {
			display: grid;
			grid-template: 'name nature ability item . star icon' 100% / 1fr 1fr 1fr 1fr 5fr auto auto;
			gap: var(--smaller-gap);
			align-items: center;
			background-color: var(--background-color);
			padding: var(--small-gap);
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
	}
</style>
