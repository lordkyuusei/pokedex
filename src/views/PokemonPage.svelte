<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import PokemonCard from "../components/PokemonCard.svelte";
    import PokemonSearch from "../components/PokemonSearch.svelte";
    import PokemonStats from "../components/PokemonStats/PokemonStats.svelte";

    import type { Pokemon } from "../store/types/Pokemon";

    export let pokemon: Pokemon = null;
    export const order: number = 0;
    export let location: any;

    onMount(() => {
        pokemon = location.state.pokemon;
    });

    afterUpdate(() => {
        pokemon = location.state.pokemon;
    });
</script>

<div class="pokemon-page">
    <button class="pokemon-back" on:click={() => navigate("/")}>⬅️</button>
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
