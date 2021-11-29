<script lang="ts">
    import { fetchPokemonInfo } from "../api/pokeapi";
    import type { Pokemon } from "../store/types/Pokemon";
    import PokemonCard from "./PokemonCard.svelte";

    let searchText: string = "";
    let pokemon: Pokemon = null;

    const searchPokemon = async (event: KeyboardEvent) => {
        if (event.code === "Enter") {
            pokemon = await fetchPokemonInfo(searchText.toLocaleLowerCase());
        }
    }
</script>

<div class="pokemon-search">
    <input
        class="search-input"
        bind:value={ searchText }
        on:keypress={ searchPokemon }
        placeholder="Rechercher un pokémon, une capacité, un objet...">
    {#if pokemon?.id && searchText !== ""}
        <PokemonCard
            id={pokemon.id.toString()}
            name={pokemon.name}
            picture={pokemon.sprites.front_default}
            types={pokemon.types}
        />
    {/if}
</div>

<style scoped>
    .pokemon-search {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 10px;
    }
    .search-input {
        border: 1px solid grey;
        border-radius: 50px;
        height: 25px;
        width: 25vw;
        padding: 10px;
        font-size: large;
    }
</style>