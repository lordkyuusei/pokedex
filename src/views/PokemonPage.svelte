<script lang="ts">
import { onMount } from "svelte";
import { navigate } from "svelte-routing";
import PokemonCard from "../components/PokemonCard.svelte";

    import type { Pokemon } from "../store/types/Pokemon";

    export let pokemon: Pokemon = null;
    export const order: number = 0;
    export let location: any;

    onMount(() => {
        pokemon = location.state.pokemon;
    })

</script>

<div class="pokemon-page">
    <button class="pokemon-back" on:click={ () => navigate('/')}>⬅️</button>
    {#if pokemon}
        <PokemonCard
            id={pokemon.id}
            order={pokemon.order}
            name={pokemon.name}
            picture={pokemon.picture}
            types={pokemon.types}
        />
    {/if}
</div>

<style scoped>

</style>