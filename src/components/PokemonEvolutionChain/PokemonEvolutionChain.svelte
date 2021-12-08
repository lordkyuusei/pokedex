<script lang="ts">

    import { beforeUpdate } from 'svelte';
    import PokemonLink from './PokemonLink.svelte';
    import PokemonTrigger from "./PokemonTrigger.svelte";
    import type { EvolutionChain, EvolutionDetail, PokemonEvolution } from "../../store/types/PokemonEvolution";

    type EvolutionUnit = {
        name: string,
        trigger?: EvolutionDetail[],
    }

    const triggerPattern = {
        1: [0],
        2: [1],
        3: [3, 2, 4],
        4: [5, 1, 6],
        5: [3, 2, 2, 2, 4],
        6: [5, 1, 1, 6],
    }


    export let evolutionChain: PokemonEvolution;
    const pokemonStages = new Map<number, EvolutionUnit[]>();

    const extractDataFromChain = (evolutionChain: EvolutionChain, level = 1) => {
        const { species, evolves_to, evolution_details } = evolutionChain;
        if (species && evolves_to.length) {
            const { url } = species;
            const evolutionUnit: EvolutionUnit = { name: url.match(/\d+/g).pop(), trigger: evolution_details};
            pokemonStages.set(level, [...pokemonStages.get(level) || [], evolutionUnit]);
            evolves_to.forEach(evolutionUnit => extractDataFromChain(evolutionUnit, level + 1));
        } else {
            pokemonStages.set(level, [...pokemonStages.get(level) || [], {name: species.url.match(/\d+/g).pop(), trigger: evolution_details}]);
            return;
        }
    }

    extractDataFromChain(evolutionChain.chain);

    beforeUpdate(() => {
        pokemonStages.clear();
        extractDataFromChain(evolutionChain.chain);
    });
</script>

<!-- evolution-card-->
<div class="pokemon-evolution-chain">
    {#each [...pokemonStages] as [stage, evolutionUnits]}
    <div class="pokemon-evolution-stage">
        {#if stage !== 1}
        <div class="stage-trigger">
            {#each triggerPattern[evolutionUnits.length] as triggerIndex, index}
                <PokemonTrigger styleType={triggerIndex} trigger={evolutionUnits[index].trigger} />
            {/each}
        </div>
        {/if}
        <div class="stage-specie">
            {#each evolutionUnits as unit}
                <PokemonLink pokemon={unit.name} {stage} maxStage={pokemonStages.size}/>
            {/each}
        </div>
    </div>
    {/each}
</div>

<style scoped>
    .pokemon-evolution-chain {
        display: flex;
        flex-direction: row;
        margin: 10px;
        padding: 5px;
        border-radius: 10px;
        border: 1px solid black;
        box-shadow: var(--theme-shadow);
    }

    .pokemon-evolution-stage {
        display: flex;
        flex-direction: row;
    }

    .stage-specie {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .stage-trigger {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
</style>