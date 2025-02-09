<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import { lang } from '$lib/store/lang';
	import { generation } from '$lib/store/generation';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import { getPkmnTypeColor, getPkmnTypeTranslation } from '$lib/functions/drawBackgroundFromTypes';

	import MoveCd from '$lib/components/fragments/MoveCD.svelte';
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
	<header id="{$page.params.type}-header">
		<aside id="header-cd">
			<MoveCd id={moveId} type={moveType} name={moveName} code={moveCode} />
		</aside>
		<div id="header-infos">
			<h1>
				{moveDesc}
			</h1>
			<table id="data-table">
				<thead>
					<tr>
						<th>Puissance</th>
						<th>Précision</th>
						<th>P.P.</th>
					</tr>
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
	</header>
	<div id="{$page.params.type}-learners">
		<h1>Pokémon pouvant l'apprendre : </h1>
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
</section>

<style>
	section[id^="moves"] {
		display: grid;
		grid-template: 'cover' 1fr 'table' 1fr / 100%;

		height: calc(100% - var(--small-gap) * 2);
		margin: var(--small-gap) var(--small-gap);
		box-shadow: var(--box-shadow);
		border-radius: var(--border-r-50);
		background-color: var(--background-second-color);
		overflow-y: auto;

		@media (max-width: 1024px) {
			margin: 0;
			border-radius: 0;
		}

		& > header[id$='-header'] {
			display: grid;
			grid-template: 'album resume' 1fr / 2fr 5fr;
			align-items: center;

			@media (max-width: 1024px) {
				gap: var(--small-gap);
				padding: var(--smaller-gap);
				grid-template: 'album' 1fr 'resume' auto / 100%;
			}

			& > aside#header-cd {
				padding: var(--small-gap);

				@media (max-width: 1024px) {
					grid-template: 100% / auto 1fr;
					aspect-ratio: inherit;
					border-radius: var(--border-r-50);
				}
			}

			& > div#header-infos {
				display: flex;
				flex-direction: column;
				height: 100%;
				gap: var(--small-gap);
				justify-content: flex-end;
				border-radius: var(--border-r-50);
				background-color: var(--background-blur-color);

				& > h1 {
					padding-inline-start: 15%;
					padding-inline-end: var(--smaller-gap);
					font-size: x-large;
				}
			}
		}

		& > div[id$='-learners'] {
			padding-inline: var(--small-gap);

			& > h1 {

			}

			& > ul {
				display: flex;
				flex-wrap: wrap;
				gap: var(--smaller-gap);
				justify-content: space-between;
				width: 100%;
			}
		}

	}
</style>
