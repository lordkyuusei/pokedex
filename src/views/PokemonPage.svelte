<script lang="ts">
    import { afterUpdate, onMount } from "svelte";

    import type { Pokemon } from "../store/types/Pokemon";
    import type { PokemonSpecie } from "../store/types/PokemonSpecie";
    import type { PokemonEvolution } from "../store/types/PokemonEvolution";

    import { fetchPokemonEvolutionChain, fetchPokemonInfo, fetchPokemonSpecie } from "../api/pokeapi";

    import PokemonCard from "../components/PokemonCard.svelte";
    import PokemonLoader from "../components/PokemonLoader.svelte";
    import PokemonSearch from "../components/PokemonSearch.svelte";
    import PokedexThemeToggle from "../components/PokedexThemeToggle.svelte";
    import PokemonStats from "../components/PokemonStats/PokemonStats.svelte";
    import PokemonEvolutionChain from "../components/PokemonEvolutionChain/PokemonEvolutionChain.svelte";

    export let pokemon: Pokemon = null;
    export let specie: PokemonSpecie = null;
    export let name: string = "";
    export let location: any;

    let evolutionChain: PokemonEvolution = null;

    onMount(async () => {
        if (location.state) {
            ;({ pokemon, specie } = location.state);
            if (!specie) {
                specie = await fetchPokemonSpecie(name);
            }
            if (!pokemon) {
                const defaultForm = specie.varieties.find(v => v.is_default);
                pokemon = await fetchPokemonInfo(defaultForm.pokemon.name);
            }
            const evolutionChainId = specie.evolution_chain.url.match(/\d+/g).pop();
            evolutionChain = await fetchPokemonEvolutionChain(evolutionChainId);
        }
    });

    afterUpdate(() => {
        if (location.state) {
            pokemon = location.state.pokemon;
        }
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
                <PokemonEvolutionChain {evolutionChain} />
            {/if}
        </div>
    {:else}
        <PokemonLoader />
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
