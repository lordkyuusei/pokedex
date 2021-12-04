<script lang="ts">
    import { beforeUpdate, onMount } from "svelte";
    import type { PokemonEvolutionChain, EvolutionChain } from "../store/types/PokemonEvolutionChain";

    export let evolutionChain: PokemonEvolutionChain = null;
    $: console.log(evolutionChain);

    const extractDataFromChain = (chain: EvolutionChain, result: any[] = []) => {
        const pokemon = chain.species.name;
        const evolution = chain.evolves_to[0];
        if (evolution) {
            result.push({
                pokemon,
                evolution: evolution.species.name,
                level: evolution.evolution_details[0].min_level,
            });
            extractDataFromChain(evolution, result);
        } else {
            result.push({ pokemon, evolution: null, level: null });
            return result;
        }
    };

    beforeUpdate(() => {
        const chain = extractDataFromChain(evolutionChain.chain);
        console.log(chain)
    })
</script>