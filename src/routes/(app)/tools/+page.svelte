<script lang="ts">
	import BattleFactoryHelper from '$lib/components/features/tools/BattleFactoryHelper.svelte';
	import CatchRateEvaluator from '$lib/components/features/tools/CatchRateEvaluator.svelte';
	import TypesCoverageEvaluator from '$lib/components/features/tools/TypesCoverageEvaluator.svelte';
	import { generation } from '$lib/store/generation';

	type ToolName = 'none' | 'catch-rate' | 'types-coverage' | 'emerald-battle-factory';

	type ToolComponent =
		| typeof CatchRateEvaluator
		| typeof TypesCoverageEvaluator
		| typeof BattleFactoryHelper;

	type Tool = {
		name: ToolName;
		component: ToolComponent | null;
	};

	const tools: Tool[] = [
		{ name: 'catch-rate', component: CatchRateEvaluator },
		{ name: 'types-coverage', component: TypesCoverageEvaluator },
		{ name: 'emerald-battle-factory', component: BattleFactoryHelper }
	];

	const defaultTool = {
		name: 'none' as const,
		component: null
	};

	let selectedTool: Tool = defaultTool;
</script>

<section id="pokedex-tools">
	<header>
		{#if selectedTool !== defaultTool}
			<button on:click={() => (selectedTool = defaultTool)}>Retour</button>
			<h1>{selectedTool.name}</h1>
		{:else}
			<h1>Outils divers</h1>
		{/if}
	</header>
	{#if selectedTool === defaultTool}
		<div id="tools-list">
			{#each tools as tool}
				<button on:click={() => (selectedTool = tool)}>{tool.name}</button>
			{/each}
		</div>
	{:else}
		<svelte:component this={selectedTool.component} generation={$generation}></svelte:component>
	{/if}
</section>

<style>
	section#pokedex-tools {
		display: grid;
		height: 100%;
		grid-template: auto 1fr / 100%;

		padding: var(--small-gap);

		& > header {
		}

		& > div#tools-list {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(33%, 1fr));
			gap: var(--small-gap);
		}
	}
</style>
