<script lang="ts">
    import { fade } from 'svelte/transition';
    
    import PokemonType from "./PokemonType.svelte";
    import POKEMON_TYPES from "../store/pokemon-types";

    export let id: string = "";
    export let order: number = 0;
    export let name: string = "Missing";
    export let picture: string = "Missing"
    export let types: PokemonType[] = [];

    const drawCardBackground = (types: PokemonType[]) => {
        const [fType, sType] = types.map(type => POKEMON_TYPES.filter(ref => ref.name === type.type.name)[0].color);
        return sType ? `linear-gradient(90deg, ${fType} 0%, ${sType} 100%)` : fType;
    }

    const computePokemonId = (id: string) => `${id}`.padStart(3, "0");
</script>

<div class="pokemon-card" {id} style={`background: ${drawCardBackground(types)};`} in:fade>
    <div class="pokemon-id">
        <div class="pokemon-number">N°{ computePokemonId(id) }</div>
        <div class="pokemon-name">{ name }</div>
        <div class="pokemon-order">{ order }</div>
    </div>
    <div class="pokemon-picture">
        <img src={ picture } alt={ name }> 
    </div>
    <div class="pokemon-types">
        {#each types as type (type.type.name)}
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
    height: 40vh;
    width: 20vw;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    transition: 0.3s;
    cursor: pointer;
}

@media (max-width: 1350px) and (min-width: 601px) {
    .pokemon-card {
        width: 40vw;
    }
}

@media (max-width: 600px) and (min-width: 480px) {
    .pokemon-card {
        width: 45vw;
    }
}

@media (max-width: 479px) {
    .pokemon-card {
        width: 80vw;
        min-width: 80vw;
    }
}

.pokemon-card:hover {
    transform: translateY(-5px);
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
}

.pokemon-id {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
}

.pokemon-number {
    text-shadow: 1px -1px aliceblue;
}

.pokemon-name {
    margin: 10px;
    padding: 10px;
    font-size: 18px;
    text-align: center;
    letter-spacing: 2px;
    font-weight: bolder;
    border-radius: 25px;
    width: fit-content;
    text-transform: capitalize;
    background-color: rgba(255, 255, 255, 0.5);
}

.pokemon-picture {
    position: relative;
    width: 100%;
}

.pokemon-picture img {
    border-radius: 50px;
    background-color: rgba(255, 255, 255, 0.3);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 15vh;
    width: auto;
    margin: auto;
}

.pokemon-types {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

</style>