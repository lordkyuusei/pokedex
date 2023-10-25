<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import { lang } from '$lib/store/lang';
	import { generation } from '$lib/store/generation';

	import {
		drawBoxShadow,
		drawMoveCover,
		getPkmnTypeColor,
		getPkmnTypeLang,
		getPkmnTypeTranslation
	} from '$lib/functions/drawBackgroundFromTypes';

	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	export let data: PageData;

	$: movesListForGen = data.typesMovesList
		.filter((gen) => gen.id <= $generation.id)
		.flatMap((gen) => gen.moves);

	const averagePower = (moves: any[]) => {
		const powerfulMoves = moves.filter((x) => x.power !== 0);
		return (
			powerfulMoves.reduce((acc, move) => acc + move.power, 0) / powerfulMoves.length
		).toFixed(1);
	};

	const averageAccuracy = (moves: any[]) => {
		const accurateMoves = moves.filter((x) => x.accuracy !== 0);
		return (
			accurateMoves.reduce((acc, move) => acc + move.accuracy, 0) / accurateMoves.length
		).toFixed(1);
	};

	const maximumPower = (moves: any[]) => {
		const allPower = moves.map((m) => m.power);
		return Math.max(...allPower);
	};
</script>

<section id="moves-{data.type}" style:--type-color={getPkmnTypeColor(data.type)}>
	<section id="{data.type}-cover" out:fade>
		<aside id="cover-album" style:background={drawMoveCover(data.type)}>
			<img
				style:box-shadow={drawBoxShadow(data.type)}
				src="/icons/{data.type}.png"
				alt={data.type}
			/>
			<p style:text-shadow={drawBoxShadow(data.type)}>{getPkmnTypeTranslation(data.type)}</p>
		</aside>
		<div id="cover-infos">
			<small>Liste d'attaques</small>
			<h1>
				Liste des capacités de type <b>{getPkmnTypeLang(data.type, $lang)}</b>
			</h1>
			<small>Génération <b>{$generation.id}</b></small>
			<p>
				<b>{movesListForGen.length}</b> capacités • <b>{averagePower(movesListForGen)}</b> de
				puissance moyenne •
				<b>{averageAccuracy(movesListForGen)}</b> de précision moyenne
			</p>
			<p>Puissance la plus élevée: <b>{maximumPower(movesListForGen)}</b></p>
		</div>
	</section>
	<section id="{data.type}-table">
		<table>
			<thead>
				<th>#</th>
				<th>NOM</th>
				<th>PUISSANCE</th>
				<th>PP</th>
				<th>PRECISION</th>
			</thead>
			<tbody>
				{#each movesListForGen as move}
					<tr on:click={() => goto(`/moves/${move.moveType}/${move.id}`)}>
						<td>{move.id}</td>
						<td>{move.i18n[$lang] || `(pas de traduction pour ${move.name})`}</td>
						<td>{move.power || '---'}</td>
						<td>{move.pp || '---'}</td>
						<td>{move.accuracy || '---'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</section>

<style>
	[id^='moves-'] {
		display: grid;
		grid-template:
			'cover' 1fr
			'table' 5fr / 100%;
		gap: var(--small-gap);
		padding: 2em;

		height: 100%;
		width: 100%;
	}

	[id^='moves-'] > [id$='-cover'] {
		display: grid;
		grid-template: 'cover desc' 100% / 1fr 4fr;
		gap: var(--small-gap);
		align-items: center;
	}

	[id^='moves-'] > [id$='-cover'] > #cover-album {
		display: grid;
		grid-template: 'header' 1fr 'footer' 1fr / 100%;
		justify-items: center;
		align-items: center;
		gap: var(--normal-gap);
		padding: 1em;
		aspect-ratio: 1;
		border-radius: var(--border-r-100);
	}

	[id^='moves-'] > [id$='-cover'] > #cover-album img {
		border-radius: var(--border-r-100);
	}

	[id^='moves-'] > [id$='-cover'] > #cover-album p {
		font-family: 'Pokemon';
		font-size: 5em;
		margin: 0;
	}

	[id^='moves-'] > [id$='-cover'] > #cover-infos {
		display: flex;
		flex-direction: column;
		gap: var(--small-gap);

		font-size: 1.25em;
		padding-block-end: 1em;
	}

	[id^='moves-'] > [id$='-cover'] > #cover-infos h1,
	[id^='moves-'] > [id$='-cover'] > #cover-infos p {
		margin: 0;
	}

	[id^='moves-'] > [id$='-cover'] > #cover-infos h1 {
		line-height: 1em;
		font-size: 2em;
	}

	[id^='moves-'] > [id$='-cover'] > #cover-infos b {
		color: var(--primary-color);
		text-transform: uppercase;
	}

	[id^='moves-'] > [id$='-table'] {
		text-align: center;
		height: 100%;
		width: 100%;
		overflow-y: auto;
	}

	[id^='moves-'] > [id$='-table'] table tr:hover > td {
		background-color: var(--type-color);
	}

	[id^='moves-'] > [id$='-table'] table td {
		height: 3em;
	}
</style>
