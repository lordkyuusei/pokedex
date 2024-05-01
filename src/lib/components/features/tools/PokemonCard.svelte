<script lang="ts">
	import type { FactoryPokemon } from '$lib/types/battle-factory';

	export let pokemon: FactoryPokemon;
	export let isLvl100Mode: boolean = false;

	$: stats = pokemon[isLvl100Mode ? 'lv100Stats' : 'lv50Stats'].split('/');
	$: evs = pokemon['evs'].split('/');
</script>

<div class="pokemon-info">
	<div class="figure">
		<img src="" />
		<span class="figcaption"
			>{pokemon.name} ({pokemon['variant']})
			<div>Lv. {isLvl100Mode ? '100' : '50'}</div></span
		>
	</div>
	<ul class="info-data">
		<li>Nature: <span>{pokemon.nature}</span></li>
		<li>Ability: <span>{pokemon.ability}</span></li>
		<li>Item: <span>{pokemon.item}</span></li>
	</ul>
	<ul class="info-moves">
		<li>{pokemon['1stMove']}</li>
		<li>{pokemon['2ndMove']}</li>
		<li>{pokemon['3rdMove']}</li>
		<li>{pokemon['4thMove']}</li>
	</ul>
	<ul class="info-stats">
		<li>HP: <span>{stats[0]} / {evs[0]}</span></li>
		<li>ATK: <span>{stats[1]} / {evs[1]}</span></li>
		<li>DEF: <span>{stats[2]} / {evs[2]}</span></li>
		<li>SPA: <span>{stats[3]} / {evs[3]}</span></li>
		<li>SPD: <span>{stats[4]} / {evs[4]}</span></li>
		<li>SPE: <span>{stats[5]} / {evs[5]}</span></li>
	</ul>
</div>

<style>
	/* Template:PokemonCard */
	.pokemon-info {
		display: grid;
		grid-template:
			'figure data stats' 2fr
			'moves moves moves' 1fr / 1fr 3fr 1fr;

		background: hsl(232, 28%, 16%);
		gap: 0.5rem;
	}

	.pokemon-info > .figure,
	.pokemon-info > ul {
		background: hsl(232, 28%, 20%);
		border-radius: 0.5rem;

		padding: 0.5rem;
	}

	.pokemon-info .figure {
		grid-area: figure;

		display: grid;
		place-content: center;
		margin: 0;
		padding: 0;
		text-align: center;
	}

	.pokemon-info .figure pre {
		all: initial;
	}

	.pokemon-info .figure .figcaption {
		background: hsla(232, 28%, 16%, 50%);
		border-radius: 0.5rem;
		width: auto;
	}

	.pokemon-info .info-data {
		grid-area: data;
	}

	.pokemon-info .info-moves {
		grid-area: moves;

		display: grid;
		grid-template: 1fr 1fr / 1fr 1fr;
		gap: 0.25rem;
	}

	.pokemon-info .info-moves img {
		height: 2rem;
		width: 2rem;
		border-radius: 2rem;
	}

	.pokemon-info .info-stats {
		grid-area: stats;
	}

	.pokemon-info .info-data,
	.pokemon-info .info-stats {
		display: grid;
	}

	.pokemon-info .info-data li,
	.pokemon-info .info-moves li,
	.pokemon-info .info-stats li {
		display: grid;
		grid-template-columns: 1fr 5fr;
		gap: 0.5rem;
		align-items: center;
		justify-items: flex-end;
		text-transform: capitalize;
	}

	.pokemon-info .info-data li > span {
		display: grid;
		grid-auto-flow: column;
		text-align: center;
	}

	.pokemon-info .info-data li:first-child span {
		padding-inline: 0.25rem;
	}

	.pokemon-info .info-data li.single span {
		grid-template-columns: auto;
		border-radius: 0.25rem;
	}

	.pokemon-info .info-data li.double span {
		grid-template-columns: auto auto;
	}

	.pokemon-info .info-data li.double span > span:first-of-type {
		border-radius: 0.25rem 0 0 0.25rem;
	}

	.pokemon-info .info-data li.double span > span:last-of-type {
		border-radius: 0 0.25rem 0.25rem 0;
	}

	.pokemon-info .info-moves li {
		background: hsl(232, 28%, 36%);
		border-radius: 1rem;
		justify-items: flex-start;

		background-repeat: no-repeat;
		background-size: 2rem;
		background-position-x: calc(100% - 0.5rem);
		background-position-y: center;
		background-blend-mode: soft-light;
	}

	.pokemon-info .info-moves li.physical {
		background-image: url(https://archives.bulbagarden.net/media/upload/b/b4/PhysicalIC_SV.png);
	}

	.pokemon-info .info-moves li.special {
		background-image: url(https://archives.bulbagarden.net/media/upload/5/5b/SpecialIC_SV.png);
	}

	.pokemon-info .info-moves li.status {
		background-image: url(https://archives.bulbagarden.net/media/upload/e/e0/StatusIC_SV.png);
	}

	.pokemon-info ul {
		list-style: none !important;
		margin: 0 !important;
	}

	.pokemon-info li {
		text-wrap: nowrap !important;
		margin: 0 !important;
	}
</style>
