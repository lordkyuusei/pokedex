<script lang="ts">
	import { goto } from '$app/navigation';

	import {
		drawBoxShadow,
		drawMoveCover,
		getPkmnTypeColor,
		getPkmnTypeLang,
		getPkmnTypeTranslation
	} from '$lib/functions/drawBackgroundFromTypes';
	import { lang } from '$lib/store/lang';
	import { generation } from '$lib/store/generation';

	import type { PageData } from './$types';

	export let data: PageData;

	let scrollY: number;

	let movesListForGen: [] = data.typesMovesList
		.filter((gen) => gen.id <= $generation.id)
		.flatMap((gen) => gen.moves);

	let averageMovesPower: string = movesListForGen
		.filter((move) => move.power !== 0)
		.reduce((power: number, move: any, i: number, allMoves) => {
			const cumulativePower = power + move.power;
			if (i === allMoves.length - 1) {
				return cumulativePower / allMoves.length;
			}
			return cumulativePower;
		}, 0)
		.toFixed(0);

	let averageMovesAccuracy: string = movesListForGen
		.filter((move) => move.accuracy !== 0)
		.reduce((accuracy: number, move: any, i: number, allMoves) => {
			const cumulativeAccuracy = accuracy + move.accuracy;
			if (i === allMoves.length - 1) {
				return cumulativeAccuracy / allMoves.length;
			}
			return cumulativeAccuracy;
		}, 0)
		.toFixed(0);

	let maximumMovePower: number = Math.max(...movesListForGen.map((move) => move.power));
</script>

<section
	id="moves-{data.type}"
	style:--type-color={getPkmnTypeColor(data.type)}
	style:background={drawMoveCover(data.type)}
>
	<header id="{data.type}-cover">
		<aside id="cover-album" style:background={drawMoveCover(data.type)}>
			<img
				style:box-shadow={drawBoxShadow(data.type)}
				src="/icons/{data.type}.png"
				alt={data.type}
			/>
			<p class="pokemon-font" style:text-shadow={drawBoxShadow(data.type)}>
				{getPkmnTypeTranslation(data.type)}
			</p>
		</aside>
		<div id="cover-infos">
			<h1>
				Liste des capacités de type <b>{getPkmnTypeLang(data.type, $lang)}</b>
			</h1>
			<small>Génération <b>{$generation.id}</b></small>
			<p>
				<b>{movesListForGen.length}</b> capacités • <b>{averageMovesPower}</b> de puissance moyenne
				•
				<b>{averageMovesAccuracy}</b> de précision moyenne
			</p>
			<p>
				<img src="/icons/{data.type}.png" alt={data.type} /> • Puissance la plus élevée:
				<b>{maximumMovePower}</b>
			</p>
		</div>
	</header>
	<table id="{data.type}-table">
		<thead>
			<tr>
				<th colspan="1">#</th>
				<th colspan="2">NOM</th>
				<th colspan="2">PUISSANCE</th>
				<th colspan="2">PP</th>
				<th colspan="2">PRECISION</th>
			</tr>
		</thead>
		<tbody>
			{#each movesListForGen as move}
				<tr on:click={() => goto(`/moves/${move.moveType}/${move.id}`)}>
					<td colspan="1">{move.id}</td>
					<td colspan="2">{move.i18n[$lang] || `(pas de traduction pour ${move.name})`}</td>
					<td colspan="2">{move.power || '---'}</td>
					<td colspan="2">{move.pp || '---'}</td>
					<td colspan="2">{move.accuracy || '---'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<style>
	section[id^='moves-'] {
		display: grid;
		grid-template: 'cover' 1fr 'table' 1fr / 100%;

		height: calc(100% - var(--small-gap) * 2);
		margin: var(--small-gap) var(--small-gap);
		box-shadow: var(--box-shadow);
		border-radius: var(--border-r-50);
		overflow-y: auto;

		@media (max-width: 1024px) {
			margin: 0;
			border-radius: 0;
		}

		& > header[id$='-cover'] {
			display: grid;
			grid-template: 'album resume' 1fr / 1fr 4fr;
			gap: var(--normal-gap);
			align-items: center;
			padding: var(--normal-gap);
			background-color: var(--background-blur-second-color);

			@media (max-width: 1024px) {
				gap: var(--small-gap);
				padding: var(--small-gap);
				grid-template: 'album' auto 'resume' 1fr / 100%;
			}

			& > aside#cover-album {
				display: grid;
				grid-template: 1fr 1fr / 100%;
				justify-items: center;
				align-items: center;
				gap: var(--small-gap);
				padding: var(--small-gap);
				aspect-ratio: 1;
				border-radius: var(--border-r-100);

				@media (max-width: 1024px) {
					grid-template: 100% / auto 1fr;
					aspect-ratio: inherit;
					border-radius: var(--border-r-50);
				}

				& > img {
					border-radius: var(--border-r-50);
				}

				& > p {
					font-family: 'Pokemon';
					font-size: 2.5em;
					letter-spacing: var(--smallest-gap);
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

		& > table[id$='-table'] {
			text-align: center;
			height: 100%;
			width: 100%;
			padding: var(--small-gap);

			background: linear-gradient(
				to top,
				var(--background-second-color) 30%,
				var(--background-blur-second-color) 120%
			);

			& > thead {
				position: sticky;
				top: 0;
			}
		}
	}
</style>
