<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';

	import { lang } from '$lib/store/lang';
	import { generation } from '$lib/store/generation';
	import MoveCd from '$lib/components/common/MoveCD.svelte';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import { getPkmnTypeColor, getPkmnTypeTranslation } from '$lib/functions/drawBackgroundFromTypes';

	export let data: PageData;

	$: id = data.moveDetails.id;
	$: name = data.moveDetails.names.find((x) => x.language.name === ($lang ?? 'fr')).name;
	$: type = data.moveDetails.type.name;
	$: code = getPkmnTypeTranslation($page.params.type) ?? '';

	$: description = data.moveDetails.flavor_text_entries.find(
		(x) => x.language.name === ($lang ?? 'fr')
	).flavor_text;

	$: pkmnLearnedPerGen = data.moveDetails.learned_by_pokemon.filter((p) => {
		const id = Number(p.url.split('/').at(-2));
		return id < $generation.boundaries.to;
	});
</script>

<section id="moves-{$page.params.type}" style:--type-color={getPkmnTypeColor($page.params.type)}>
	<MoveCd {id} {type} {name} {code} />
	<section id="{$page.params.type}-data">
		<h1>
			{description}
		</h1>
		<table id="data-table">
			<thead>
				<th>Puissance</th>
				<th>Précision</th>
				<th>P.P.</th>
			</thead>
			<tbody>
				<tr>
					<td>{data.moveDetails.power}</td>
					<td>{data.moveDetails.accuracy}</td>
					<td>{data.moveDetails.pp}</td>
				</tr>
			</tbody>
		</table>
	</section>
	<section id="{$page.params.type}-pokemon">
		<h1>Les pokémon suivants peuvent apprendre cette attaque:</h1>
		<div>
			{#each pkmnLearnedPerGen as { name, url }}
				<a href="/pokemon/{url.split('/').at(-2)}/moves">
					<img
						src={fetchPokemonSpriteURL(url.split('/').at(-2), 'icons', 'generation-viii')}
						alt={name}
					/>
				</a>
			{/each}
		</div>
	</section>
</section>

<style>
	[id^='moves-'] {
		display: grid;
		grid-template:
			'cover data' 2fr
			'table table' 5fr / 1fr 1fr;
		gap: var(--normal-gap);
		padding: 2em;

		height: 100%;
		width: 100%;
	}

	[id^='moves-'] > [id$='-data'] {
		display: grid;
		grid-template:
			'desc' 2fr
			'table' 1fr / 100%;
		align-content: center;
		width: 100%;
	}

	[id^='moves-'] > [id$='-data'] h1 {
		font-size: 1.5em;
		line-height: 1em;
	}

	[id^='moves-'] > [id$='-data'] table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
		text-align: center;
	}

	[id^='moves-'] > [id$='-data'] table > thead > th:not(:first-child, :last-child),
	[id^='moves-'] > [id$='-data'] table > tbody td:not(:first-child, :last-child) {
		border-left: 2px solid var(--background-color-___);
		border-right: 2px solid var(--background-color-___);
	}

	[id^='moves-'] > [id$='-data'] table th,
	[id^='moves-'] > [id$='-data'] table td {
		height: 2em;
	}

	[id^='moves-'] > [id$='-pokemon'] {
		grid-area: table;
		display: grid;
		grid-template:
			'h1' auto
			'pokemon' 100% / 100%;
		column-gap: 0.5em;
		row-gap: 2em;

		overflow-y: auto;
		width: 100%;
		height: 100%;
	}

	[id^='moves-'] > [id$='-pokemon'] h1 {
		grid-area: h1;
		font-size: 2em;
		margin: 0;
	}

	[id^='moves-'] > [id$='-pokemon'] div {
		grid-area: pokemon;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5em, 1fr));
		column-gap: 0.5em;
		height: 100%;
		width: 100%;
		overflow-y: scroll;
	}
</style>
