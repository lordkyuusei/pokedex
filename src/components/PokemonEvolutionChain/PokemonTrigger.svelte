<script lang="ts">
    enum TriggerStyleType {
        OneStraight = 0,
        TwoStraight = 1,
        OneStraightAndBoth = 2,
        OneStraightTop = 3,
        OneStraightBottom = 4,
        OneStraightFullTop = 5,
        OneStraightFullBottom = 6,
    };

    import OneStraightTrigger from "./TriggerLinks/OneStraightTrigger.svelte";
    import TwoStraightTrigger from "./TriggerLinks/TwoStraightTrigger.svelte";
    import OneStraightAndBoth from "./TriggerLinks/OneStraightAndBoth.svelte";
    import OneStraightTop from "./TriggerLinks/OneStraightTop.svelte";
    import OneStraightBottom from "./TriggerLinks/OneStraightBottom.svelte";
    import OneStraightFullTop from "./TriggerLinks/OneStraightFullTop.svelte";
    import OneStraightFullBottom from "./TriggerLinks/OneStraightFullBottom.svelte";

    import type { EvolutionDetail } from "../../store/types/PokemonEvolution";

    export let trigger: EvolutionDetail[] = null;
    export let styleType: TriggerStyleType;

    const options = [
        {
            styleType: TriggerStyleType.OneStraight,
            component: OneStraightTrigger,
        },
        {
            styleType: TriggerStyleType.TwoStraight,
            component: TwoStraightTrigger,
        },
        {
            styleType: TriggerStyleType.OneStraightAndBoth,
            component: OneStraightAndBoth,
        },
        {
            styleType: TriggerStyleType.OneStraightTop,
            component: OneStraightTop,
        },
        {
            styleType: TriggerStyleType.OneStraightBottom,
            component: OneStraightBottom,
        },
        {
            styleType: TriggerStyleType.OneStraightFullTop,
            component: OneStraightFullTop,
        },
        {
            styleType: TriggerStyleType.OneStraightFullBottom,
            component: OneStraightFullBottom,
        },
    ];

</script>

<svelte:component class="trigger" this={options[styleType].component} />