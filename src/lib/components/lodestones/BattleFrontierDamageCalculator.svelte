<script lang="ts">
	import { calcGenIIIDamageFormula } from '$lib/constants/battle-factory';
	import { OLD_PHYSICAL_TYPES } from '$lib/constants/pokemon_types';
	import { fetchFullTypes } from '$lib/functions/computeTypesRelationship';
	import type { FactoryPokemon } from '$lib/types/battle-factory';
	import type { LightMoveDetails } from '$lib/types/lightmove';

	type Props = {
		user: FactoryPokemon;
		target: FactoryPokemon;
		move: LightMoveDetails & { style: number };
		isLvL100Mode: boolean;
	};

	let { user, target, move, isLvL100Mode }: Props = $props();

	let atkCoeff = user.item === 'Choice Band' ? 1.5 : 1;
	let moveType = $derived(fetchFullTypes([move.moveType])[0]);

	let offensiveStat: [string, number, number] = $derived(
		OLD_PHYSICAL_TYPES.includes(moveType.id) ? ['Atk', user.evs[1], user.lv100Stats[1] * atkCoeff] : ['SpAtk', user.evs[3], user.lv100Stats[3]]
	);

	let defensiveStat: [string, number, number] = $derived(
		OLD_PHYSICAL_TYPES.includes(moveType.id) ? ['Def', target.evs[2], target.lv100Stats[2]] : ['SpDef', target.evs[4], target.lv100Stats[4]]
	);

	let defensiveStats: [string, number, number, string, number, number] = $derived(['Hp', target.evs[0], target.lv100Stats[0], ...defensiveStat]);

	let damage = $derived(calcGenIIIDamageFormula(user, target, move, offensiveStat[2], defensiveStats[5], 100));
	let percentageDamage = $derived([(damage[0] / defensiveStats[2]) * 100, (damage.at(-1) / defensiveStats[2]) * 100]);
	let percentageDamageDisplay = $derived(`${percentageDamage[0].toFixed(1)}-${percentageDamage[1].toFixed(1)}%`);

	const calcKillPercentage = (dmg: number[]) => {
		const numberOfHits = Math.ceil(100 / percentageDamage[1]);

		const killingBlows = dmg.filter((pd) => pd * numberOfHits >= defensiveStats[2]).length;
		const killingPercentage = (killingBlows / dmg.length) * 100;

		return `${killingPercentage}% chance to ${numberOfHits === 1 ? 'O' : numberOfHits}HKO`;
	};

	let killPercentage = $derived(calcKillPercentage(damage));
</script>

{#if damage}
	<b>{offensiveStat[1]} {offensiveStat[0]} {user.item}</b>
	{user.name}-{user.variant}
	{move.i18n.en} vs <b>{defensiveStats[1]} {defensiveStats[0]} / {defensiveStats[4]} {defensiveStats[3]}</b>
	{target.name}-{target.variant}: <b>{damage[0]}-{damage.at(-1)} ({percentageDamageDisplay})</b> -- {killPercentage}.
{:else}
	<b>Click on a move to compute the damage range on the currently selected opponent or ally.</b>
{/if}

<style>
</style>
