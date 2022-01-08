<script lang="ts">
	import type { EntityRef, MoveRef } from '$lib/types/Pokemon';
	import { onMount } from 'svelte';
	import Card from './PokemonLayouts/Card.svelte';

	const methods = ['level-up', 'tutor', 'machine'];

	export let moves: MoveRef[] = [];
	let versionChosen: string = 'ultra-sun-ultra-moon';
	let methodChosen: string = 'level-up';

	type MoveLight = {
		move: MoveRef;
		level: number;
		method: EntityRef;
	};

	$: pokemonVersions = extractVersions(moves);

	$: pokemonMoves = extractMoves(moves, versionChosen);

	$: pokemonMovesPerLevel = pokemonMoves
		.filter((move) => move.method.name === 'level-up')
		.sort((a, b) => a.level - b.level);

	$: pokemonMovesViaTutor = pokemonMoves
		.filter((move) => move.method.name === 'tutor')
		.sort((a, b) => a.move.move.name.localeCompare(b.move.move.name));

	$: pokemonMovesViaTM = pokemonMoves
		.filter((move) => move.method.name === 'machine')
		.sort((a, b) => a.move.move.name.localeCompare(b.move.move.name));

	$: displayMoves =
		methodChosen === 'level-up'
			? pokemonMovesPerLevel
			: methodChosen === 'tutor'
			? pokemonMovesViaTutor
			: pokemonMovesViaTM;

	const extractMoves = (moves: MoveRef[], version: string): MoveLight[] => {
		const moveset = moves.map((move) => {
			const version_details = move.version_group_details.find(
				(group) => group.version_group.name === version
			);
			return version_details
				? {
						move: move,
						level: version_details.level_learned_at,
						method: version_details.move_learn_method
				  }
				: null;
		});
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

	onMount(() => {
		return () => {};
	});
</script>

<Card cover huge full title="Moveset">
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
					<th>Move Name</th>
					<th>Learning at level</th>
				</tr>
			</thead>
			<tbody class="table-body">
				{#each displayMoves as move}
					<tr>
						<td class="move-name">{displayMove(move.move.move.name)}</td>
						<td class="move-level">{move.level}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</Card>

<style>
	.pokemon-versions,
	.pokemon-methods {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 100%;
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
		background-color: var(--theme-secondary);
	}

	.version-button:first-child {
		border-radius: 10px 0 0 0;
		border-width: 0 1px 1px 0;
	}

	.version-button:last-child {
		border-radius: 0 10px 0 0;
		border-width: 0 0 1px 1px;
	}

	.version-button:only-child {
		border-radius: 10px 10px 0 0;
		border-width: 0 0 1px 0;
	}

	.pokemon-moveset {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		width: 100%;
		height: calc(100% - 4em);
		overflow-y: scroll;
	}

	.moveset-table {
		width: 90%;
		border-collapse: collapse;
		table-layout: auto;
	}

	.table-head {
		position: sticky;
		height: 2rem;
	}

	.table-head th {
		border-bottom: 1px solid var(--theme-background);
		background-color: var(--theme-background);
		color: var(--theme-text);
		padding: 0.5rem;
		font-weight: bold;
	}

	.table-body {
		position: sticky;
		top: 2rem;
	}

	.move-level {
		text-align: center;
	}
</style>
