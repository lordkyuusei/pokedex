<script lang="ts">
import { onDestroy, onMount } from "svelte";

    import { fetchPokemonInfo, fetchPokemonBulk } from "../api/pokeapi";
    import PokemonCard from "../components/PokemonCard.svelte";

    let allPokemon: any[] = [];
    let nextUrl: number[] = [30, 0];
    let target;

    const options = {
        root: document.querySelector("#pokemon-list"),
        threshold: 1.0
    };

    const callback = (entries, observer) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
            interStalker.unobserve(target);
            promise = fetchPokemon().then(() => {
                target = document.querySelector('#last-pokemon');
                interStalker.observe(target);
            });
        }
    }
    const interStalker = new IntersectionObserver(callback, options);

    const fetchPokemon = async () => {
        const pokemonList = await fetchPokemonBulk(nextUrl[0], nextUrl[1]);
        const { results } = pokemonList;
        nextUrl[1] += 30
        for (let pokemon of results) {
            const { name } = pokemon;
            const pokemonInfo = await fetchPokemonInfo(name);
            allPokemon = [...allPokemon, { 
                name: pokemonInfo.name,
                picture: pokemonInfo.sprites.front_default,
                types: pokemonInfo.types
            }];
        }
    }

    let promise: any;

    onMount(() => {
        promise = fetchPokemon().then(() => {
            setTimeout(() => {
                target = document.querySelector('#last-pokemon');
                interStalker.observe(target);
            }, 2000);
        })
    });

    onDestroy(() => {
        interStalker.unobserve(target);
    })
</script>

<div class="pokemon-list" id="pokemon-list">
    {#await promise && nextUrl[1] === 0}
        <h1 id="scrollArea">Récupération d'un pokémon...</h1>
    {:then}
        {#each allPokemon as pokemon, index}
            <PokemonCard id={index === allPokemon.length - 1 ? "last-pokemon" : `pokemon-${index + 1}`}
                name={pokemon.name}
                picture={pokemon.picture}
                types={pokemon.types}
            />
        {/each}
    {/await}
</div>

<style scoped>
.pokemon-list {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
}
</style>