<script lang="ts">
    import type { StatRef } from "../../store/types/Pokemon";
    import { getStatColor, getStatHeight } from "../../lib/getStylesFromStat";
    import { HPFormula, StatFormula } from "../../lib/getStatFromFormula";

    export let stat: StatRef;
    export let evs: number = 0
    export let ivs: number = 0;
    export let lvl: number = 0

    $: statHeight = getStatHeight(stat.base_stat);
    $: statColor = getStatColor(stat.base_stat);
    $: maxStatValue = stat.stat.name === "hp" ? HPFormula(stat.base_stat, lvl, evs, ivs) : StatFormula(stat.base_stat, lvl, evs, ivs);

    const statToIcon = {
        "hp": "HP",
        "attack": "ATK",
        "defense": "DEF",
        "special-attack": "SPA",
        "special-defense": "SPD",
        "speed": "SPE",
        "average": "AVG",
    }
    
</script>

<div class="pokemon-stat">
    <div class="stat-value">
        { stat.base_stat }
        { statToIcon[stat.stat.name] }
    </div>
    <div class="stat-jauge" style={ `height: ${statHeight}; background-color: ${statColor}`}>
    </div>
    {#if stat.stat.name !== "average"}
        <div class="stat-result">
            { maxStatValue }
        </div>
    {/if}
</div>

<style scoped>
    .pokemon-stat {
        width: 30px;
        height: 100%;
        border-radius: 5px;
        position: relative;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
    }
    
    .stat-value {
        width: 100%;
        height: auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        z-index: 1;
    }

    .stat-jauge {
        transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        width: 100%;
        border-radius: 5px;
    }

    .stat-result {
        flex: 1;
    }
</style>