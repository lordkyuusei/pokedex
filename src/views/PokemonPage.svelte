<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { navigate } from "svelte-routing";

    import type { Pokemon } from "../store/types/Pokemon";
    import type { PokemonSpecie } from "../store/types/PokemonSpecie";
    import type { PokemonEvolutionChain } from "../store/types/PokemonEvolutionChain";

    import { fetchPokemonEvolutionChain, fetchPokemonInfo, fetchPokemonSpecie } from "../api/pokeapi";

    import PokemonCard from "../components/PokemonCard.svelte";
    import PokemonSearch from "../components/PokemonSearch.svelte";
    import PokedexThemeToggle from "../components/PokedexThemeToggle.svelte";
    import PokemonStats from "../components/PokemonStats/PokemonStats.svelte";
    import PokemonEvolution from "../components/PokemonEvolution.svelte";

    export let pokemon: Pokemon = null;
    export let specie: PokemonSpecie = null;
    export let name: string = "";
    export let location: any;

    let evolutionChain: PokemonEvolutionChain = null;

    onMount(async () => {
        if (location.state) {
            specie = location.state.specie;
            pokemon = location.state.pokemon;
        } else {
            specie = await fetchPokemonSpecie(name);
            const defaultForm = specie.varieties.find(v => v.is_default);
            pokemon = await fetchPokemonInfo(defaultForm.pokemon.name);

        }    
        const evolutionChainId = specie.evolution_chain.url.match(/\d+/g).pop();
        evolutionChain = await fetchPokemonEvolutionChain(evolutionChainId);
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
