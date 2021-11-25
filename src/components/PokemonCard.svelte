<script lang="ts">
import PokemonType from "./PokemonType.svelte";

    type ApiType = {
        name: string,
        url: string,
    };
    type PokemonType = {
        slot: number,
        type: ApiType,
    };

    export let id: string = "";
    export let name: string = "Missing";
    export let picture: string = "Missing"
    export let types: PokemonType[] = [];
</script>

<div class="pokemon-card" {id}>
    <div class="pokemon-name">{ name }</div>
    <div class="pokemon-picture">
        <img src={ picture } alt={ name }> 
    </div>
    <div class="pokemon-types">
        {#each types as type}
            <PokemonType name={ type.type.name } />
        {/each}
    </div>

</div>

<style scoped>

.pokemon-card {
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: 1px solid black;
    border-radius: 10px;
    min-height: 40vh;
}

@media (max-width: 812px) {
    .pokemon-card {
        width: 100%;
    }
}

@media (min-width: 813px) {
    .pokemon-card {
        width: 250px;
        max-width: 350px;
    }
}

.pokemon-name {
    margin: 10px;
    padding: 10px;
    font-size: 18px;
    font-weight: bolder;
    border: 1px solid black;
    border-radius: 25px;
    text-align: center;
    width: fit-content;
    text-transform: capitalize;
}

.pokemon-types {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

</style>