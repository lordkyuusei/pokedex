<script lang="ts">
	import t from '$lib/store/i18n';
	import { generation } from '$lib/store/generation';
	import routes from "./routes.json";

</script>

<section id="pokedex-tools">
	<div id="tools">
		<header>
			<!-- {#if selectedTool !== defaultTool}
				<button on:click={() => (selectedTool = defaultTool)}>Retour</button>
				<h1>{$t(`tools.${selectedTool.name}`)}</h1>
			{:else}
				<h1>Outils divers</h1>
			{/if} -->
		</header>
		<!-- {#if selectedTool === defaultTool} -->
			<div id="tools-list">
				{#each routes as route}
					<a href="/tools/{route.id}">{$t(`${route.name}`)}</a>
				{/each}
			</div>
		<!-- {:else} -->
		<!-- {/if} -->
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

				& > a {
					border-radius: var(--border-r-100);
				}
			}

			& > div#tools-list {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
				gap: var(--small-gap);

				& > a {
					border-radius: var(--border-r-50);
				}
			}
		}
	}
</style>
