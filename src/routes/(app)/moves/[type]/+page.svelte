<script lang="ts">
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
	<div id="type-moves" style:background={drawMoveCover(data.type)}>
		<header id="{data.type}-cover">
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
				<p>
					<img src="/icons/{data.type}.png" alt={data.type} /> • Puissance la plus élevée:
					<b>{maximumPower(movesListForGen)}</b>
				</p>
			</div>
		</header>
		<div id="{data.type}-table">
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
		</div>
	</div>
</section>

<style>
	section[id^='moves-'] {
		height: 100%;
		padding: var(--small-gap);

		& > div#type-moves {
			display: grid;
			grid-template:
				'cover' auto
				'table' 1fr / 100%;

			height: 100%;
			box-shadow: var(--box-shadow);
			border-radius: var(--border-r-50);
			background-color: var(--background-second-color);

			& > header[id$='-cover'] {
				display: grid;
				grid-template: 'cover desc' 100% / 25% 75%;
				gap: var(--normal-gap);
				align-items: center;
				padding: var(--normal-gap);
				background-color: var(--background-blur-second-color);

				& > aside#cover-album {
					display: grid;
					grid-template: 'header' 1fr 'footer' 1fr / 100%;
					justify-items: center;
					align-items: center;
					gap: var(--small-gap);
					padding: var(--small-gap);
					aspect-ratio: 1;
					border-radius: var(--border-r-100);

					& > img {
						border-radius: var(--border-r-50);
					}

					& > p {
						font-family: 'Pokemon';
						font-size: 3rem;
						letter-spacing: var(--smallest-gap);
						margin: 0;
					}
				}

				& > div#cover-infos {
					display: flex;
					flex-direction: column;
					height: 100%;
					gap: var(--small-gap);
					justify-content: flex-end;
					font-size: 1.25em;
					padding: var(--small-gap);
					border-radius: var(--border-r-50);
					background-color: var(--background-blur-color);

					& > h1,
					& > p {
						margin: 0;

						& > img {
							border-radius: var(--border-r-50);
							height: 1rem;
						}
					}

					& > h1 {
						font-size: 2em;
					}

					& b {
						color: var(--second-color);
						text-transform: uppercase;
					}
				}
			}

			& > div[id$='-table'] {
				text-align: center;
				height: 100%;
				width: 100%;
				overflow-y: auto;
				padding: var(--small-gap);

				background: linear-gradient(
					to top,
					var(--background-second-color) 30%,
					var(--background-blur-second-color) 120%
				);
				& > table thead {
					position: sticky;
					top: 0;
				}
				& > table tr:hover > td {
					background-color: var(--type-color);
				}
				& > table td {
					height: 3em;
				}
			}
		}
	}
</style>
