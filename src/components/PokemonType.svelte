<script lang="ts">
    import { onMount } from "svelte";
    import POKEMON_TYPES from "../store/pokemon-types";
    import type { PokemonType } from "../store/types/PokemonType";  

    export let name = "???";
    let pokemonType: PokemonType;

    onMount(() => {
        const type = POKEMON_TYPES.filter(type => type.name === name)[0];
        if (type !== undefined) {
            const { color = "#FFFFFF", icon = "🤌" } = type;
            pokemonType = { name, color, icon };
        }
    })
</script>

<div class="pokemon-type" style={`background-color: ${pokemonType?.color};`}>
    <div class="pokemon-icon">{ pokemonType?.icon }</div>
    <div class="pokemon-typename"> { pokemonType?.name }</div>
</div>

<style scoped>
.pokemon-type {
    display: grid;
    grid-template-columns: 25px auto;
    min-width: 40%;
    margin: 10px;
    border: 1px solid black;
    border-radius: 50px;
    text-transform: uppercase;
}

.pokemon-icon {
    text-align: center;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    width: 100%;
}

.pokemon-typename {
    text-align: center;
    letter-spacing: 2px;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
    color: white;
}

</style>