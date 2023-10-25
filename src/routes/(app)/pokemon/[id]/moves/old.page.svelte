<svelte:options immutable />

<script lang="ts">
	import type { PageData } from './$types';

	import { lang } from '$lib/store/lang';
	import { version } from '$lib/store/generation';
	import extractMoves from '$lib/functions/extractMoves';
	import { sortMethod } from '$lib/functions/sortMoves';
	import { fly } from 'svelte/transition';

	export let data: PageData;

	let searchText: string;
	let searchOpt: string = 'level-up';
	let sortOption: { key: string; order: boolean } = { key: 'level', order: true };
	let moveExtendId: string;

	$: moves = extractMoves(data.pokemon.moves, data.moveSet, $version, $lang);

	$: displayMoves = [...moves]
		.filter((x) => x.method.name === searchOpt)
		.sort((a, z) => sortMethod(a, z, sortOption));

	$: searchOptions = [...new Set(moves.map((x) => x.method.name))] || [];
	$: moveProperties = Object.keys(moves[0] ?? []).filter(
		(x) => !['description', 'method', 'id'].includes(x)
	);

	const displayMove = (move: string | number | object, prop: string) => {
		const mapPropToText = [
			{
				p: (prop: string) => prop === 'names',
				text: (move) => move.names.find((x) => x.language.name === $lang).name
			},
			{
				p: (prop: string) => prop === 'descriptions',
				text: (move) => move.descriptions.find((x) => x.language.name === $lang).flavor_text
			},
			{
				p: (prop: string) => prop === 'method',
				text: (move) => move.method.name
			},
			{
				p: (prop: string) => prop === 'power',
				text: (move) => move.power ?? '---'
			},
			{
				p: (prop: string) => prop === 'accuracy',
				text: (move) => move.accuracy ?? '---'
			},
			{ p: (prop: string) => true, text: (move) => move[prop] }
		];

		return mapPropToText.find((x) => x.p(prop))?.text(move);
	};

	const setSortMethod = (category: string) => {
		if (sortOption.key === category) {
			sortOption = { ...sortOption, order: !sortOption.order };
		} else {
			sortOption = { key: category, order: true };
		}
	};

	const setExtendedMove = (move: string) => {
		moveExtendId = moveExtendId === move ? '' : move;
	};
</script>

<section id="data-moves">
	<section id="moves">
		<header id="moves-options">
			<input type="search" bind:value={searchText} />
			<select id="options-select" bind:value={searchOpt}>
				{#each searchOptions as opt}
					<option value={opt}>{opt}</option>
				{/each}
			</select>
		</header>
		<section id="moves-table-box">
			<table id="moves-table">
				<thead>
					{#each moveProperties as prop (prop)}
						<th class="move-{prop}" on:click={() => setSortMethod(prop)}>{prop}</th>
					{/each}
				</thead>
				<tbody>
					{#each displayMoves as move (move.id)}
						{#if !searchText || (searchText && move.name
									.toLowerCase()
									.includes(searchText.toLowerCase()))}
							<tr on:click={() => setExtendedMove(move.id)}>
								{#each moveProperties as prop}
									<td class="move-{prop}">{displayMove(move, prop)}</td>
								{/each}
							</tr>
							{#if moveExtendId === move.id}
								<tr in:fly>
									<td class="move-description" colspan="5">{move.description}</td>
									<td class="move-action" colspan="3">
										<a href="/moves/{move.id}"> <button>Plus d'info</button></a>
									</td>
								</tr>
							{/if}
						{/if}
					{/each}
				</tbody>
			</table>
		</section>
	</section>
</section>

<style>
	#data-moves {
		display: grid;
		place-items: center;
		padding: var(--normal-gap);
		overflow-y: auto;
	}

	#moves {
		display: grid;
		grid-template:
			'filters' 2fr
			'table' 50fr / 100%;

		border-radius: var(--border-r-200);
		background-color: var(--background-color);

		overflow-y: auto;
		height: 100%;
		width: 100%;
	}

	#moves-options {
		grid-area: filters;
	}

	#moves-table-box {
		grid-area: table;

		height: 100%;
		overflow-y: auto;
	}

	#moves-options {
		display: flex;
		place-items: center;
		gap: 1em;
		border-bottom: 1px solid var(--background-accent);
		padding: 0.5em 1em;
	}

	#moves-options input {
		font-size: 1.5em;
		border-radius: var(--border-r-100);
		border: none;
		background-color: var(--text-color);
		color: var(--background-color);
		padding: 0 1.5em 0 1em;
	}

	#options-select {
		cursor: pointer;
		appearance: none;
		padding: 0.5em;
		border: none;
		text-transform: uppercase;
		text-align: center;
	}

	#options-select:focus {
		outline: none;
	}

	#options-select,
	#options-select option {
		background: var(--background-color);
		color: var(--text-color);
		border: 1px solid var(--text-color);
		border-radius: var(--border-r-100);
	}

	#moves-table {
		width: 100%;
		overflow-y: auto;
		border-collapse: collapse;
		table-layout: fixed;
	}

	#moves-table > thead th {
		width: 100%;
		padding: 0.5rem;
		cursor: pointer;
		font-weight: bolder;
		text-transform: capitalize;
		color: var(--primary-color);
		border-bottom: 1px solid var(--background-accent);
		background-color: var(--background-color);
		transition: all 0.2s ease-in-out;
	}

	#moves-table > thead th:hover {
		border-color: var(--primary-color);
	}

	#moves-table > tbody tr:nth-child(2n + 1) {
		background-color: var(--background-accent);
	}

	#moves-table [class^='move-'] {
		padding: 0.5em;
		text-align: center;
		cursor: pointer;
	}

	#moves-table .move-description {
		padding: 1em 0.5em;
	}

	#moves-table > tbody tr:hover {
		background-color: var(--background-alt-color);
	}
</style>
