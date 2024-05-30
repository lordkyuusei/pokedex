<script lang="ts">
	import type { EvolutionDetail, EvolutionUnit } from '$lib/types/pokeapi/evolution';

	export let unit: EvolutionUnit;
	export let size: number = 1;

	let selectedTrigger: EvolutionDetail = unit.trigger[0];

	const findTriggers = (mainTrigger: EvolutionDetail) => {
		const triggers = Object.entries(mainTrigger).filter(([_, value]) => {
			if (typeof value === 'boolean') return value !== false;
			else if (typeof value === 'string') return ![null, ''].includes(value);
			else return value !== null;
		});

		return triggers.reduce((acc, [name, value]) => {
			return `${acc} (${name}: ${value?.name ?? value})`;
		}, '');
	};
</script>

<section class="section-{size}-rows">
	<span class="trigger-name">
		{#if selectedTrigger}
			{selectedTrigger.trigger.name} - {findTriggers({ ...selectedTrigger, trigger: null })}
		{/if}
	</span>
	<span class="trigger-separator" />
	<span class="trigger-list">
		{#if unit.trigger?.length > 1}
			{#each unit?.trigger as trigger, i}
				<button
					class:selected={selectedTrigger === trigger}
					on:click={() => (selectedTrigger = trigger)}>{i + 1}</button
				>
			{/each}
		{/if}
	</span>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
	}

	.section-1-rows {
		height: 25%;
	}

	.section-2-rows {
		height: 25%;
	}

	.section-3-rows {
		height: 50%;
	}

	.section-8-rows {
		height: 100%;
	}

	span {
		display: flex;
		place-content: center;
		place-items: center;
		width: 100%;
		height: 1em;
	}

	.trigger-name {
		color: var(--text-color);
	}

	.trigger-separator {
		background-color: var(--background-color-___);
	}

	.trigger-list {
		display: flex;
		gap: var(--small-gap);
	}

	button {
		aspect-ratio: 1;
		border: none;
		border-radius: 50%;
		cursor: pointer;
	}

	.selected {
		background-color: var(--background-color-___);
		color: var(--background-color-__);
	}
</style>
