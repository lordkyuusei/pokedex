<script lang="ts">
    import type { StatRef } from "../../store/types/Pokemon";
    import PokemonStat from "./PokemonStat.svelte";

    export let statistics: StatRef[];
    let evs: number = 252;
    let ivs: number = 31;
    let lvl: number = 100

    $: averageStat = {
        base_stat: Math.floor(statistics.map(stat => stat.base_stat).reduce((prev, next) => prev + next) / statistics.length),
        effort: 0,
        stat: { name: "average", url: ""}
    }
</script>

<div class="pokemon-stats">
    {#each statistics as stat}
        <PokemonStat {stat} {evs} {ivs} {lvl} />
    {/each}

    <svelte.fragment></svelte.fragment>

    <PokemonStat stat={averageStat} />
    <div class="stats-iel">
        <div class="iel-value">
            { evs }
            { "EVs" }
        </div>
        <input class="iel-slider" type="range" step="4" min="0" max="252" value={evs} on:input={event => evs = event.target.valueAsNumber} />
    </div>
    <div class="stats-iel">
        <div class="iel-value">
            { ivs }
            { "IVs" }
        </div>
        <input class="iel-slider" type="range" min="0" max="31" value={ivs} on:input={event => ivs = event.target.valueAsNumber} />
    </div>
    <div class="stats-iel">
        <div class="iel-value">
            { lvl }
            { "LVL" }
        </div>
        <input class="iel-slider" type="range" min="1" max="100" value={lvl} on:input={event => lvl = event.target.valueAsNumber} />
    </div>
</div>

<style scoped>
    .pokemon-stats {
        margin: 10px;
        padding: 5px;
        display: grid;
        border: 1px solid black;
        grid-template-columns: repeat(11, 42px);
        grid-template-rows: 100%;
        justify-content: center;
        align-items: center;
        justify-items: center;
        align-content: stretch;
        border-radius: 10px;
        height: 40vh;
        width: auto;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    }

    .stats-iel {
        width: 30px;
        height: 100%;
        border-radius: 5px;
        position: relative;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
    }
    
    .iel-value {
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        z-index: 1;
    }

    .iel-slider {
        width: 100%;
        height: 100%;
        border-radius: 5px;
        writing-mode: vertical-rl;
        -webkit-appearance: slider-vertical;
    }
</style>