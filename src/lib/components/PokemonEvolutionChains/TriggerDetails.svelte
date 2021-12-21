<script lang="ts">
	import { fetchItemSpriteURL } from '$lib/api';
	import { onMount } from 'svelte';

	import triggerI18n from '$lib/store/triggers.json';
	import filterObject from '$lib/filterObject';
	import type { EntityRef } from '$lib/types/Pokemon';
	import type { EvolutionDetail } from '$lib/types/PokemonEvolutionChain';

	type evolutionChain = {
		name: string;
		conditions: EvolutionDetail;
	};

	export let props: any;
	let evolutionChain: evolutionChain[] = [];

	let mapTriggernameToPicture = {
		'level-up': () => fetchItemSpriteURL('rare-candy'),
		trade: () => fetchItemSpriteURL('premier-ball'),
		'use-item': () => '/pointing_hand.png',
		'hold-item': () => '/holding_hand.png'
	};

	const isEntityRef = (obj: any): obj is EntityRef => {
		return obj.hasOwnProperty('name');
	};

	const isMove = (obj: any): obj is EntityRef => {
		return (obj.hasOwnProperty('url') && obj.url.includes('move')) || obj.url.includes('type');
	};

	const isLocation = (obj: any): obj is EntityRef => {
		return obj.hasOwnProperty('url') && obj.url.includes('location');
	};

	const getCondition = (key: string) => {
		return triggerI18n.find((trigger) => trigger.key === key).en;
	};

	onMount(() => {
		const { triggers }: { triggers: EvolutionDetail[] } = props;
		console.log(triggers);
		const evolutionDetails = triggers.map((triggersList) => {
			const { trigger, ...conditions }: any = filterObject(triggersList, (elem) => elem);
			return {
				name: trigger.name,
				conditions
			};
		});
		evolutionChain = evolutionDetails;
	});
</script>

<div class="evolution-chain-trigger-details">
	{#each evolutionChain as { name, conditions }}
		<div class="trigger-details">
			<img src={`${mapTriggernameToPicture[name]()}`} class="evolution_trigger_name" alt={name} />
			<div class="evolution_trigger_details">
				{#each Object.keys(conditions) as condition, index}
					{#if ['string', 'number'].includes(typeof conditions[condition])}
						{`[${getCondition(condition)}]: ${conditions[condition]}`}
					{:else if isMove(conditions[condition])}
						<img
							src={fetchItemSpriteURL('tm-normal')}
							alt={condition}
							title={`[${getCondition(condition)}]: ${conditions[condition].name}`}
						/>
					{:else if isLocation(conditions[condition])}
						<img
							src={fetchItemSpriteURL('town-map')}
							alt={condition}
							title={`[${getCondition(condition)}]: ${conditions[condition].name}`}
						/>
					{:else if isEntityRef(conditions[condition])}
						<img
							src={fetchItemSpriteURL(conditions[condition].name)}
							class="evolution_trigger_details_item"
							alt={conditions[condition].name}
						/>
					{/if}
				{/each}
			</div>
		</div>
	{/each}
</div>

<style scoped>
	.evolution-chain-trigger-details {
		display: flex;
		justify-content: center;
		align-items: center;
		grid-row: 1;
	}

	.trigger-details {
		display: flex;
		justify-content: center;
		align-items: center;
		grid-row: 1;
	}

	.evolution_trigger_name {
		background-color: var(--theme-cardglass);
		border-radius: 25px;
		height: 3em;
		image-rendering: pixelated;
	}
</style>
