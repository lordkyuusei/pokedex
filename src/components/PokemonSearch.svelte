<script lang="ts">
    import { Link } from "svelte-routing";
    import { fetchPokemonInfo, fetchPokemonSpecie } from "../api/pokeapi";
    import type { Pokemon } from "../store/types/Pokemon";
    import type { PokemonSpecie } from "../store/types/PokemonSpecie";
    import PokemonCard from "./PokemonCard.svelte";

    let searchText: string = "";
    const placeholder = "Rechercher un pokémon";
    let pokemon: PokemonSpecie = null;
    let pokemonForms: Pokemon[] = [];

    const searchPokemon = async (event: KeyboardEvent) => {
        if (event.code === "Enter") {
            pokemonForms = [];
            pokemon = await fetchPokemonSpecie(searchText.toLocaleLowerCase());
            pokemon.varieties.map(async (form) => {
                const variety = await fetchPokemonInfo(form.pokemon.name);
                pokemonForms = [...pokemonForms, variety];
            });
        }
        if (event.target.value === "") {
            pokemon = null;
            pokemonForms = [];
        }
    };
</script>

<div class="pokemon-search">
    <input
        class="search-input"
        bind:value={searchText}
        on:keypress={searchPokemon}
        {placeholder}
    />
    {#if pokemonForms.length && searchText !== ""}
        <h1>Résultat de la recherche</h1>
        <div class="search-result">
            {#each pokemonForms as form}
                <Link
                    to={`pokemon/${form.id}`}
                    state={{ pokemon: form }}
                    on:click={() => (pokemonForms = [])}
                >
                    <PokemonCard
                        id={form.id.toString()}
                        name={form.name}
                        picture={form.sprites.front_default}
                        order={form.order}
                        types={form.types}
                    />
                </Link>
            {/each}
        </div>
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

    .search-result {
        display: flex;
        flex-wrap: wrap;
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
