<script lang="ts">
    import { onMount } from "svelte";

    import { fetchPokemonSpriteURL } from "../../api/pokeapi";

    export let stage: number = 1;
    export let maxStage: number;
    export let pokemon: string = "";

    let spriteURL: string = "";

    onMount((): void => {
        spriteURL = fetchPokemonSpriteURL(pokemon, "versions", "generation-viii", "icons");
        console.log(stage, maxStage)
    });
</script>

<div class="pokemon-link">
    {#if stage !== 1}
        <div class="link link-before"></div>
    {/if}

    <div class="link-picture">
        <img src={spriteURL} alt={pokemon}/>
    </div>

    {#if stage !== maxStage}
        <div class="link link-after"></div>
    {/if}
</div>

<style scoped>
    .pokemon-link {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: 100%;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .link {
        height: 0px;
        border-width: 5px;
        border-style: solid;
    }
    
    .link-before {
        grid-column: 1;
        border-top-right-radius: 25px;
        border-bottom-right-radius: 25px;
    }

    .link-picture {
        grid-column: 2;
        align-self: center;
    }

    .link-picture img {
        margin-bottom: 20px;
    }   

    .link-after {
        grid-column: 3;
        border-top-left-radius: 25px;
        border-bottom-left-radius: 25px;
    }
</style>