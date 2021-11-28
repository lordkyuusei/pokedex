<script lang="ts">
    import PokemonType from "./PokemonType.svelte";
    import POKEMON_TYPES from "../store/pokemon-types";

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

    const drawCardBackground = (types: PokemonType[]) => {
        const [fType, sType] = types.map(type => POKEMON_TYPES.filter(ref => ref.name === type.type.name)[0].color);
        return sType ? `linear-gradient(90deg, ${fType} 0%, ${sType} 100%)` : fType;
    }
</script>

<div class="pokemon-card" {id} style={`background: ${drawCardBackground(types)};`}>
    <div class="pokemon-name">{ name }</div>
    <div class="pokemon-picture">
        <img src={ picture } alt={ name } > 
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
    height: 40vh;
    width: 20vw;
}

@media (max-width: 812px) {
    .pokemon-card {
    }
}

@media (min-width: 813px) {
    .pokemon-card {
    }
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

.pokemon-types {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

</style>