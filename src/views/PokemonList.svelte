<script lang="ts">
    import { Link } from "svelte-routing";
    import { onDestroy, onMount } from "svelte";

    import PokedexThemeToggle from '../components/PokedexThemeToggle.svelte';
    import PokemonCard from "../components/PokemonCard.svelte";
    import PokemonSearch from "../components/PokemonSearch.svelte";
    import { fetchPokemonInfo, fetchPokemonBulk } from "../api/pokeapi";

    let target: Element;
    let allPokemon: any[] = [];
    let nextUrl: number[] = [30, 0];

    const options = {
        root: document.querySelector("#pokemon-list"),
        threshold: 1.0,
    };

    const interStalker = new IntersectionObserver((entries: any[], _: any) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
            interStalker.unobserve(target);
            promise = fetchPokemon().then(() => {
                target = document.querySelector("#last-pokemon");
                interStalker.observe(target);
            });
        }
    }, options);

    const fetchPokemon = async () => {
        const { results } = await fetchPokemonBulk(nextUrl[0], nextUrl[1]);
        nextUrl[1] += 30;
        for (let entity of results) {
            const pokemonInfo = await fetchPokemonInfo(entity.name);
            allPokemon = [
                ...allPokemon,
                {
                    id: pokemonInfo.id,
                    order: pokemonInfo.order,
                    name: pokemonInfo.name,
                    picture: pokemonInfo.sprites.front_default,
                    types: pokemonInfo.types,
                    stats: pokemonInfo.stats,
                },
            ];
        }
    };

    let promise: any;

    onMount(() => {
        promise = fetchPokemon().then(() => {
            setTimeout(() => {
                target = document.querySelector("#last-pokemon");
                interStalker.observe(target);
            }, 1000);
        });
    });

    onDestroy(() => {
        if (target) {
            interStalker.unobserve(target);
        }
    });
</script>

<template>
    <PokedexThemeToggle />
    <h1>Pokédex (uniquement en anglais)</h1>
    <div class="pokemon-search">
        <PokemonSearch />
    </div>
    <div class="pokemon-list" id="pokemon-list">
        {#await promise && nextUrl[1] === 0}
            <h1 id="scrollArea">Récupération d'un pokémon...</h1>
        {:then}
            {#each allPokemon as pokemon, index}
                <Link to={`pokemon/${pokemon.name}`} state={{ pokemon }}>
                    <PokemonCard
                        id={index === allPokemon.length - 1
                            ? "last-pokemon"
                            : `${index + 1}`}
                        order={pokemon.order}
                        name={pokemon.name}
                        picture={pokemon.picture}
                        types={pokemon.types}
                    />
                </Link>
            {/each}
        {/await}
    </div>
</template>

<style scoped>
    .pokemon-search {
        display: flex;
        justify-content: center;
    }

    .pokemon-list {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    * {
        text-decoration: none;
    }
</style>
