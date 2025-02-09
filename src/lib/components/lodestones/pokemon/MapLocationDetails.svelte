<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import t from '$lib/store/i18n';
	import { lang } from '$lib/store/lang';
	import type { LocationWithCoords, SimplifiedLocation } from '$lib/types/location';

	export let selectedArea: LocationWithCoords;
	export let locationsPerGame: SimplifiedLocation[];

	let selectedCondition: number | null = null;
	let selectedGame: string | null = locationsPerGame[0].version;

	let dispatch = createEventDispatcher();

	const setSelectedGame = (game: SimplifiedLocation) => {
		selectedGame = game.version;
	};

	const toggleSelectedCondition = (condition: number) => {
		selectedCondition = selectedCondition === condition ? null : condition;
	}

	const headers = [
		{ key: 'rate'  },
		{ key: 'level'  },
		{ key: 'method'  },
		{ key: 'conditions'  },
	];

const closeLocationDetails = () => dispatch('close');
</script>

<aside id="location-details">
	<header id="details-header">
		<span>{selectedArea.i18nName[$lang]}</span>
		<button class="round" on:click={closeLocationDetails}>❌</button>
	</header>
	<div id="details-game">
		{#each locationsPerGame as game}
			<button class:selected={selectedGame === game.version} on:click={() => setSelectedGame(game)}>
				{game.version}
			</button>
		{/each}
	</div>
	<table id="details-area">
		<thead>
			<tr>
				{#each headers as header}
					<th>{$t(`location.header.${header.key}`)}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each selectedArea.conditions as condition, i}
			{@const { min_level, max_level, chance, method, condition_values } = condition}
			<tr>
					<td class="chance">{chance}%</td>
					<td class="level">Lv. {min_level - max_level === 0 ? min_level : `[${min_level} - ${max_level}]`}</td>
					<td class="method">{$t(`location.method.${method.name}`) ?? method.name}</td>
					<td>
						{#if condition_values.length > 0}
							<button class="round condition" on:click={() => toggleSelectedCondition(i)}>
								{selectedCondition === i ? '⬆️' : '⬇️'}
							</button>
						{:else}
							❌
						{/if}
					</td>
				</tr>
				{#if condition.condition_values.length > 0 && selectedCondition === i}
					<tr>
						<td style="text-transform: capitalize" colspan="4">
							{condition.condition_values.map((c) => $t(`location.condition.${c.name}`) ?? c.name).join(', ')}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</aside>

<style>
	aside#location-details {
		--margin: var(--small-gap);

		display: grid;
		grid-template: var(--layout-header-size) calc(var(--layout-header-size) / 1.5) 1fr / 100%;
		grid-area: 1 / 2 / 1 / 2;

		height: fit-content;
		max-height: calc(100% - calc(var(--margin) / 0.5));
		width: calc(100% - var(--margin));
		margin: calc(var(--margin)) var(--margin) 0 0;
		border-radius: var(--border-r-50);
		background-color: var(--background-color);
		box-shadow: var(--box-shadow);
		z-index: 2;

		& > header#details-header {
			display: grid;
			grid-template: 100% / 1fr auto;
			place-items: center;
			padding-inline: var(--small-gap);
			background-color: var(--text-color);
			border-radius: var(--border-r-50) var(--border-r-50) 0 0;

			& > span {
				grid-area: 1 / 1 / 1 / span 2;
				color: var(--background-color);
			}

			& > button {
				grid-area: 1 / 2 / 1 / 2;
			}
		}

		& > div#details-game {
			display: grid;
			grid-auto-flow: column;
			grid-auto-columns: 1fr;

			& > button.selected {
				color: var(--background-color);
				font-weight: bold;
				background-color: var(--second-color);
			}
		}

		& > table#details-area :is(th, td) {
			text-align: center;
		}
	}

	@media (max-width: 1024px) {
		aside#location-details {
			grid-template: calc(var(--layout-header-size) * 1.5) calc(var(--layout-header-size) / 1.5) 1fr / 100%;
			grid-area: 1 / 1 / 1 / 3;
			margin: var(--margin) 0 0 calc(var(--margin) / 2)
		}
	}
</style>
