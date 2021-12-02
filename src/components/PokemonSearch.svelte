<script lang="ts">
    import { Link } from "svelte-routing";
    import { fetchPokemonInfo } from "../api/pokeapi";
    import type { Pokemon } from "../store/types/Pokemon";
    import PokemonCard from "./PokemonCard.svelte";

    let searchText: string = "";
    const placeholder = "Rechercher un pokémon";
    let pokemon: Pokemon = null;

    const searchPokemon = async (event: KeyboardEvent) => {
        if (event.code === "Enter") {
            pokemon = await fetchPokemonInfo(searchText.toLocaleLowerCase());
        }
        if (event.target.value === "") {
            pokemon = null;
        }
    }
</script>

<div class="pokemon-search">
    <input class="search-input" bind:value={ searchText } on:keypress={ searchPokemon } { placeholder }>
    {#if pokemon?.id && searchText !== ""}
        <h1>Résultat de la recherche</h1>
        <Link to={`pokemon/${pokemon.order}`} state={{ pokemon }} on:click={() => pokemon = null}>
            <PokemonCard
                id={pokemon.id.toString()}
                name={pokemon.name}
                picture={pokemon.sprites.front_default}
                order={pokemon.order}
                types={pokemon.types}
            />
        </Link>
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

    @media (max-width: 1350px) and (min-width: 601px) {
        .search-input {
            width: 50vw;
        }
    }

    @media (max-width: 600px) and (min-width: 480px) {
        .search-input {
            width: 45vw;
        }
    }

    @media (max-width: 479px) {
        .search-input {
            width: 80vw;
            min-width: 80vw;
        }
    }

</style>