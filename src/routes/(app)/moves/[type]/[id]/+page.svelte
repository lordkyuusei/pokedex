<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import { lang } from '$lib/store/lang';
	import { generation } from '$lib/store/generation';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import { getPkmnTypeColor, getPkmnTypeTranslation } from '$lib/functions/drawBackgroundFromTypes';

	import MoveCd from '$lib/components/common/MoveCD.svelte';
	import type { PokemonMove } from '$lib/types/pokeapi/move';
	import type { EntityRef } from '$lib/types/pokeapi/pokemon';

	export let data: PageData;

	let moveId: number = 0;
	let moveName: string = '';
	let moveType: string = '';
	let moveCode: string = '';
	let moveDesc: string = '';
	let matchingPkmn: EntityRef[] = [];

	$: if (data.moveDetails && $lang && $generation) loadMoveDetails(data.moveDetails);

	const loadMoveDetails = (move: PokemonMove) => {
		const { id, names, type, flavor_text_entries: entries, learned_by_pokemon: pkmns } = move;

		moveId = parseInt(id);
		moveType = type.name;

		const detailName = names.find((n) => n.language.name === $lang);
		moveName = detailName?.name ?? '';

		const detailEntry = entries.find((x) => x.language.name === $lang);
		moveDesc = detailEntry?.flavor_text ?? '';

		matchingPkmn = pkmns.filter((p) => {
			const id = Number(p.url.split('/').at(-2));
			return id < $generation.boundaries.to;
		});
	};

	$: moveCode = getPkmnTypeTranslation($page.params.type);
</script>

<section id="moves-{$page.params.type}" style:--type-color={getPkmnTypeColor($page.params.type)}>
	<div id="type-moves">
		<MoveCd id={moveId} type={moveType} name={moveName} code={moveCode} />
		<div id="{$page.params.type}-data">
			<h1>
				{moveDesc}
			</h1>
			<table id="data-table">
				<thead>
					<th>Puissance</th>
					<th>Précision</th>
					<th>P.P.</th>
				</thead>
				<tbody>
					<tr>
						<td>{data.moveDetails.power ?? '---'}</td>
						<td>{data.moveDetails.accuracy ?? '---'}</td>
						<td>{data.moveDetails.pp}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div id="{$page.params.type}-pokemon">
			<h1>Les pokémon suivants peuvent apprendre cette attaque:</h1>
			<ul>
				{#each matchingPkmn as { name, url }}
					{@const pkmnUrl = url.split('/').at(-2) ?? 'espeon'}
					<li>
						<a class="squircle" href="/pokemon/{pkmnUrl}/moves">
							<img src={fetchPokemonSpriteURL(pkmnUrl, 'icons', 'generation-viii')} alt={name} />
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	section[id^='moves-'] {
		height: 100%;
		padding: var(--small-gap);

		& > div#type-moves {
			display: grid;
			gap: var(--normal-gap);
			width: 100%;
			padding: var(--small-gap);
			border-radius: var(--border-r-50);
			background-color: var(--background-second-color);
			box-shadow: var(--box-shadow);

			& > div[id$='-data'] {
				display: grid;
				grid-template:
					'desc' 1fr
					'table' 1fr / 100%;
				gap: var(--small-gap);
				align-content: center;

				padding: var(--normal-gap);
				border-radius: var(--border-r-50);
				background-color: var(--background-color);

				& > h1 {
					margin: 0;
					font-size: 1.5rem;
				}

				& > table {
					width: 100%;
					border-collapse: collapse;
					table-layout: fixed;
					text-align: center;

					& > thead > th:not(:first-child, :last-child),
					& > tbody td:not(:first-child, :last-child) {
						border-left: 2px solid var(--background-color);
						border-right: 2px solid var(--background-color);
					}
				}
			}

			& > div[id$='-pokemon'] {
				grid-area: table;
				display: grid;
				grid-template:
					'h1' auto
					'pokemon' 1fr / 100%;

				height: 100%;
				overflow-y: auto;
				row-gap: var(--normal-gap);

				& > h1 {
					grid-area: h1;
					font-size: 1.5rem;
					margin: 0;
				}

				& > ul {
					grid-area: pokemon;

					display: flex;
					align-items: flex-start;
					flex-wrap: wrap;
					gap: var(--small-gap);
					height: 100%;
					overflow-y: auto;

					& > li {
						display: grid;
						place-items: center;
					}
				}
			}
		}
	}

	@media (min-width: 1024px) {
		div#type-moves {
			height: 100%;
			grid-template:
				'cover data' auto
				'table table' 1fr / 0.5fr 1fr;
		}
	}

	@media (max-width: 1024px) {
		section[id^='moves-'] {
			overflow-y: auto;
		}

		div#type-moves {
			height: auto;
			overflow-y: auto;
			grid-template:
				'cover' auto
				'data' auto
				'table' auto / 100%;
		}
	}
</style>
