<script lang="ts">
    import { onMount } from "svelte";

    import PokemonLink from './PokemonLink.svelte';
    import PokemonTrigger from "./PokemonTrigger.svelte";
    import type { EvolutionChain, PokemonEvolution } from "../../store/types/PokemonEvolution";

    export let evolutionChain: PokemonEvolution;
    const pokemonStages = new Map<number, string[]>();

    const extractDataFromChain = (evolutionUnit: EvolutionChain, level = 1) => {
        const { species, evolves_to } = evolutionUnit;
        if (species && evolves_to.length) {
            const { url } = species;
            pokemonStages.set(level, [...pokemonStages.get(level) || [], url.match(/\d+/g).pop()]);
            evolves_to.forEach(evolutionUnit => extractDataFromChain(evolutionUnit, level + 1));
        } else {
            pokemonStages.set(level, [...pokemonStages.get(level) || [], species.url.match(/\d+/g).pop()]);
            return;
        }
    }

    console.log(evolutionChain);
    extractDataFromChain(evolutionChain.chain);
</script>

<div class="pokemon-evolution-chain">
    {#each [...pokemonStages] as [stage, pokemon]}
        <div class="pokemon-evolution-chain__stage">
            <div class="pokemon-evolution-chain__stage-title">
                {stage}
            </div>
            <div class="pokemon-evolution-chain__stage-pokemon">
                {#each pokemon as pokemonName}
                    <PokemonLink pokemon={pokemonName} {stage} maxStage={pokemonStages.size} />
                {/each}
            </div>
        </div>
    {/each}
</div>

<style scoped>
    .pokemon-evolution-chain {
        display: flex;
    }
</style>