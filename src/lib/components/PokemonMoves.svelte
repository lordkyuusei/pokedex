<script lang="ts">
	import type { EntityRef, MoveRef } from '$lib/types/Pokemon';
	import { onMount } from 'svelte';
	import Card from './PokemonLayouts/Card.svelte';
	import { fetchPokemonMove } from '$lib/api';
	import PokemonType from './PokemonType.svelte';

	const methods = ['level-up', 'tutor', 'machine'];

	export let moves: MoveRef[] = [];
	let versionChosen: string = 'ultra-sun-ultra-moon';
	let methodChosen: string = 'level-up';

	type MoveLight = {
		move: MoveRef;
		level: number;
		method: EntityRef;
		type?: EntityRef;
		power?: number;
		accuracy?: number;
		pp?: number;
		description?: string;
		category?: string;
		damageClass?: string;
	};

	$: pokemonVersions = extractVersions(moves);

	$: pokemonMoves = extractMoves(moves, versionChosen);

	$: pokemonMovesPerLevel = pokemonMoves.then((moves) =>
		moves.filter((move) => move.method.name === 'level-up').sort((a, b) => a.level - b.level)
	);

	$: pokemonMovesViaTutor = pokemonMoves.then((moves) =>
		moves
			.filter((move) => move.method.name === 'tutor')
			.sort((a, b) => a.move.move.name.localeCompare(b.move.move.name))
	);

	$: pokemonMovesViaTM = pokemonMoves.then((moves) =>
		moves
			.filter((move) => move.method.name === 'machine')
			.sort((a, b) => a.move.move.name.localeCompare(b.move.move.name))
	);

	$: displayMoves =
		methodChosen === 'level-up'
			? pokemonMovesPerLevel
			: methodChosen === 'tutor'
			? pokemonMovesViaTutor
			: pokemonMovesViaTM;

	const extractMoves = async (moves: MoveRef[], version: string): Promise<MoveLight[]> => {
		const moveset: MoveLight[] = await Promise.all(
			moves.map(async (move) => {
				const version_details = move.version_group_details.find(
					(group) => group.version_group.name === version
				);
				if (version_details) {
					const moveDetails = await fetchPokemonMove(move.move.name);
					return {
						move,
						level: version_details.level_learned_at,
						method: version_details.move_learn_method,
						type: moveDetails.type,
						power: moveDetails.power,
						accuracy: moveDetails.accuracy,
						pp: moveDetails.pp,
						category: moveDetails.meta.category.name,
						damageClass: moveDetails.damage_class.name,
						description: moveDetails.flavor_text_entries.find(
							(entry) => entry.language.name === 'en'
						)?.flavor_text
					};
				} else {
					return null;
				}
			})
		);
		return moveset.filter((move) => move !== null);
	};

	const extractVersions = (moves: MoveRef[]) => {
		const reference: MoveRef = moves.reduce((prev, next) =>
			prev.version_group_details.length > next.version_group_details.length ? prev : next
		);
		const versions = reference.version_group_details.map((version) => version.version_group.name);
		return [...new Set(versions)];
	};

	const getVersion = (version: string) =>
		version
			.split('-')
			.map((group) => group.charAt(0).toUpperCase())
			.join('');

	const displayMove = (move: string) =>
		move
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

	const displayDamageClass = (damageClass: string) =>
		[
			{ name: 'physical', icon: '🔪' },
			{ name: 'special', icon: '🔮' },
			{ name: 'status', icon: '💉' }
		].find((item) => item.name === damageClass)?.icon;

	onMount(() => {
		return () => {};
	});
</script>

<Card span="lg" size="lg">
	<div class="pokemon-versions">
		{#each pokemonVersions as version}
			<button
				class="version-button"
				class:chosen={versionChosen === version}
				on:click={() => (versionChosen = version)}>{getVersion(version)}</button
			>
		{/each}
	</div>
	<div class="pokemon-methods">
		{#each methods as method}
			<button
				class="method-button"
				class:chosen={methodChosen === method}
				on:click={() => (methodChosen = method)}>{method}</button
			>
		{/each}
	</div>
	<div class="pokemon-moveset">
		<table class="moveset-table">
			<thead class="table-head">
				<tr>
					<th>Level</th>
					<th>Name</th>
					<th>Type</th>
					<th>Power</th>
					<th>Accuracy</th>
					<th>P.P.</th>
					<th>Damage Type</th>
				</tr>
			</thead>
			<tbody class="table-body">
				{#await displayMoves}
					<tr>
						{#each [...Array(7)] as _}
							<td>...</td>
						{/each}
					</tr>
				{:then moves}
					{#each moves as move}
						<tr>
							<td class="move-level">{move.level}</td>
							<td class="move-name" title={move.description}>{displayMove(move.move.move.name)}</td>
							<td class="move-type"><PokemonType name={move.type.name} /></td>
							<td class="move-power">{move.power || '➖'}</td>
							<td class="move-accuracy">{move.accuracy || '♾️'}%</td>
							<td class="move-pp">{move.pp}</td>
							<td class="move-damage-type" title={move.damageClass}
								>{displayDamageClass(move.damageClass)}</td
							>
						</tr>
					{/each}
				{:catch error}
					<tr>
						{#each [...Array(7)] as _}
							<td>...</td>
						{/each}
					</tr>
				{/await}
			</tbody>
		</table>
	</div>
</Card>

<style>
	.pokemon-versions {
		border-radius: 10px 10px 0 0;
	}

	.pokemon-versions,
	.pokemon-methods {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 100%;
		overflow-x: scroll;
	}

	.version-button,
	.method-button {
		font: inherit;
		border-width: 0 0 1px 0;
		background-color: var(--theme-background);
		color: var(--theme-text);
		cursor: pointer;
		width: 100%;
		transition: 0.2s;
		white-space: nowrap;
		text-transform: capitalize;
		border-color: var(--theme-text);
	}

	.version-button:hover,
	.method-button:hover {
		color: var(--theme-background);
		background-color: var(--theme-text);
	}

	.chosen {
		color: white;
		background-color: var(--theme-secondary);
	}

	.pokemon-moveset {
		width: 100%;
		height: calc(100% - 4.2rem);
		overflow-y: scroll;
	}

	.moveset-table {
		width: 100%;
		border-collapse: collapse;
		table-layout: auto;
	}

	.table-head th {
		border-bottom: 1px solid var(--theme-background);
		background-color: var(--theme-alt-background);
		color: var(--theme-secondary);
		padding: 0.5rem;
		font-weight: bolder;
	}

	.table-body {
		overflow-x: scroll;
	}

	tr:nth-child(2n) {
		background-color: var(--theme-alt-background);
	}

	tr:nth-child(2n + 1) {
		background-color: var(--theme-background);
	}

	.move-name,
	.move-damage-type,
	.move-level,
	.move-pp,
	.move-power,
	.move-accuracy {
		text-align: center;
	}

	@media screen and (max-width: 425px) {
		th:nth-child(n + 4),
		td:nth-child(n + 4) {
			display: none;
		}
	}

	@media screen and (min-width: 425px) and (max-width: 768px) {
		th:nth-child(n + 6),
		td:nth-child(n + 6) {
			display: none;
		}
	}
</style>
