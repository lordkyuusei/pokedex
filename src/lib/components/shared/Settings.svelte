<script lang="ts">
	let showSettings: boolean = false;

	type Setting = {
		icon: string;
		payload: Function;
	};
	let settingsMap: Map<string, any> = new Map<string, Setting>([
		['chooseSprites', { icon: '👾', payload: () => {} }],
		['clearStorage', { icon: '💾', payload: () => {} }]
	]);
</script>

<button id="pokedex-settings-toggle" on:click={() => (showSettings = !showSettings)}>⚙️</button>

<section id="pokedex-settings-list" class:shown={showSettings}>
	<ul class="settings">
		{#each [...settingsMap] as [key, setting]}
			<li>
				<button type="button" on:click={setting.payload}>
					{setting.icon}
				</button>
			</li>
		{/each}
	</ul>
</section>

<style>
	#pokedex-settings-toggle {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--theme-alt-background);
		border: 2px solid var(--theme-background);
		border-radius: var(--theme-border-r);
		padding: 0.35em;
		position: relative;
	}

	#pokedex-settings-toggle:hover {
		cursor: pointer;
		background-color: var(--theme-background);
	}

	#pokedex-settings-list {
		position: relative;
	}

	#pokedex-settings-list > .settings {
		display: none;
		position: absolute;
		top: -10rem;
		left: -5rem;
		background-color: var(--theme-alt-background);
		border-radius: 0 var(--theme-border-r) var(--theme-border-r) 0;
		list-style: none;
		padding-inline: 0;
		padding: 0.25em 0.5em;
	}

	#pokedex-settings-list > .settings button {
		color: var(--theme-text);
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	#pokedex-settings-list.shown > .settings {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	@media (min-width: 320px) and (max-width: 1024px) {
		#pokedex-settings-list > .settings {
			top: 2em;
		}
	}
</style>
