<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { navigate } from "svelte-routing";

    import type { Pokemon } from "../store/types/Pokemon";
    import type { PokemonSpecie } from "../store/types/PokemonSpecie";
    import type { PokemonEvolutionChain } from "../store/types/PokemonEvolutionChain";

    import { fetchPokemonEvolutionChain, fetchPokemonSpecie } from "../api/pokeapi";

    import PokemonCard from "../components/PokemonCard.svelte";
    import PokemonSearch from "../components/PokemonSearch.svelte";
    import PokedexThemeToggle from "../components/PokedexThemeToggle.svelte";
    import PokemonStats from "../components/PokemonStats/PokemonStats.svelte";
    import PokemonEvolution from "../components/PokemonEvolution.svelte";

    export let pokemon: Pokemon = null;
    export let specie: PokemonSpecie = null;
    export const order: number = 0;
    export let location: any;

    let evolutionChain: PokemonEvolutionChain = null;

    onMount(async () => {
        pokemon = location.state.pokemon;
        specie = location.state.specie;
        if (!specie) {
            specie = await fetchPokemonSpecie(pokemon.name);
        }
    
        const evolutionChainId = specie.evolution_chain.url.match(/\d+/g).pop();
        evolutionChain = await fetchPokemonEvolutionChain(evolutionChainId);
    });

    afterUpdate(() => {
        pokemon = location.state.pokemon;
    });
</script>

<div class="pokemon-page">
    <PokedexThemeToggle />
    <PokemonSearch />
    {#if pokemon}
        <div class="page-details">
            <PokemonCard
                id={`${pokemon.id}`}
                order={pokemon.order}
                name={pokemon.name}
                picture={pokemon.picture || pokemon.sprites.front_default}
                types={pokemon.types}
            />
            <PokemonStats statistics={pokemon.stats} />
            {#if evolutionChain}
                <PokemonEvolution {evolutionChain} />
            {/if}
        </div>
    {/if}
</div>

<style scoped>
    .page-details {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-end;
        height: 100%;
    }
</style>
