<script lang="ts">
	import CatchRateEvaluator from '$lib/components/features/tools/CatchRateEvaluator.svelte';
	import TypesCoverageEvaluator from '$lib/components/features/tools/TypesCoverageEvaluator.svelte';
	import { generation } from '$lib/store/generation';

	type ToolName = 'none' | 'catch-rate' | 'types-coverage';

	type ToolComponent = typeof CatchRateEvaluator | typeof TypesCoverageEvaluator;
	type Tool = {
		name: ToolName;
		component: ToolComponent | null;
	};

	const tools: Tool[] = [
		{ name: 'catch-rate', component: CatchRateEvaluator },
		{ name: 'types-coverage', component: TypesCoverageEvaluator }
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
		grid-template: 10% 90% / 100%;

		padding: var(--small-gap);

		& > header {
		}

		& > div#tools-list {
			display: grid;
			grid-auto-rows: 1fr;
			gap: var(--small-gap);

			@media (max-width: 640px) {
				grid-template-columns: 100%;
			}

			@media (min-width: 640px) {
				grid-template-columns: 1fr 1fr;
			}

			& > button {
				max-width: 100%;
				aspect-ratio: 2 / 1;
			}
		}
	}
</style>
