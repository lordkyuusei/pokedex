<script lang="ts">
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import type { FactoryPokemon } from '$lib/types/battle-factory';

	type Props = {
		factoryCoverage: { [key: string]: FactoryPokemon[] };
		teamedPokemon: FactoryPokemon[];
		updateSearch: (pokemon: FactoryPokemon) => void;
	};

	let { factoryCoverage, teamedPokemon, updateSearch }: Props = $props();

	let tabs = Object.keys(factoryCoverage);
	let selectedTab = $state(tabs[0]);
	let selectedPokemon = $derived(factoryCoverage[selectedTab].sort((a, z) => a.dexId - z.dexId));
</script>

<div>
	<ul class="teamed-list">
		{#each teamedPokemon as pokemon}
			<li>
				{pokemon.name}: {pokemon.moves.map((x) => x.name).join(',')}
			</li>
		{/each}
	</ul>
	<ul class="affinities-list">
		{#each tabs as tab}
			<li>
				<button class:selected={selectedTab === tab} onclick={() => (selectedTab = tab)}
					>{tab} ({factoryCoverage[tab].length})</button
				>
			</li>
		{/each}
	</ul>
	<ul class="pokemon-list">
		{#each selectedPokemon as pokemon}
			<li class="pkmn" style:background={drawBookBackground(pokemon.types)}>
				<button style:all="unset" style:cursor="pointer" onclick={() => updateSearch(pokemon)}>
					<img
						src={fetchPokemonSpriteURL(pokemon.dexId, 'icons', 'generation-viii')}
						alt={pokemon.name}
					/>
				</button>
				{pokemon.name} / {pokemon.variant}
			</li>
		{/each}
	</ul>
</div>

<style>
	div {
		display: grid;
		grid-template-rows: auto 1fr;
		background: var(--background-second-color);
		padding: 0 var(--small-gap) var(--small-gap);
		overflow-y: auto;

		& > ul.teamed-list {
			display: flex;
		}

		& > ul.affinities-list {
			position: sticky;
			top: 0;
			display: flex;

			& > li {
				flex: 1;

				& > button {
					width: 100%;
				}
			}
		}

		& > ul.pokemon-list {
			display: grid;
			grid-template-columns: repeat(8, 1fr);
			gap: var(--small-gap);
			padding-block: var(--small-gap);

			& > li {
				display: grid;
				grid-template-rows: auto 1fr;
				justify-items: center;
				padding: 0 var(--small-gap) var(--small-gap);
				border-radius: var(--small-gap);
				text-wrap: nowrap;

				& > img {
					object-position: 0 -4px;
					max-width: var(--large-gap);
				}
			}
		}
	}
</style>
