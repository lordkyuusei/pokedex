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
    display: flex;
    justify-content: flex-start;
    align-content: space-around;
    width: 45%;
    margin: 10px;
    border: 3px solid black;
    border-radius: 50px;
    text-transform: uppercase;
}

.pokemon-icon {
    border-radius: 50px;
    background-color: white;
}

.pokemon-typename {
}

</style>