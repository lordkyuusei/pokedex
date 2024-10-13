<script lang="ts">
	import t from '$lib/store/i18n';
	import { generation } from '$lib/store/generation';

	import BattleFactoryHelper from '$lib/components/features/tools/BattleFactoryHelper.svelte';
	import CatchRateEvaluator from '$lib/components/features/tools/CatchRateEvaluator.svelte';
	import TypesCoverageEvaluator from '$lib/components/features/tools/TypesCoverageEvaluator.svelte';

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
	<div id="tools">
		<header>
			{#if selectedTool !== defaultTool}
				<button on:click={() => (selectedTool = defaultTool)}>Retour</button>
				<h1>{$t(`tools.${selectedTool.name}`)}</h1>
			{:else}
				<h1>Outils divers</h1>
			{/if}
		</header>
		{#if selectedTool === defaultTool}
			<div id="tools-list">
				{#each tools as tool}
					<button on:click={() => (selectedTool = tool)}>{$t(`tools.${tool.name}`)}</button>
				{/each}
			</div>
		{:else}
			<svelte:component this={selectedTool.component} generation={$generation}></svelte:component>
		{/if}
	</div>
</section>

<style>
	h1 {
		margin-block: 0;
	}
	section#pokedex-tools {
		height: 100%;
		padding: var(--small-gap);

		& > div#tools {
			height: 100%;
			display: grid;
			grid-template: auto 1fr / 100%;
			gap: var(--small-gap);
			padding: var(--small-gap);
			border-radius: var(--border-r-50);
			background-color: var(--background-second-color);

			& > header {
				display: flex;
				align-items: center;
				gap: var(--small-gap);

				& > button {
					border-radius: var(--border-r-100);
				}
			}

			& > div#tools-list {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
				gap: var(--small-gap);

				& > button {
					border-radius: var(--border-r-50);
				}
			}
		}
	}
</style>
