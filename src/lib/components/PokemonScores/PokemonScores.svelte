<script lang="ts">
	import { t } from '$lib/store/i18n/i18n';

	import Card from '../PokemonLayouts/Card.svelte';
	import PokemonScore from './PokemonScore.svelte';

	export let height: number = 0;
	export let weight: number = 0;
	export let steps: number = 0;
	export let gender: number = 0;
	export let rate: number = 0;
	export let egg: string[] = [];

	const egg_groups = [
		{ group: 'bug', icon: '🐛' },
		{ group: 'ditto', icon: '💡' },
		{ group: 'field', icon: '🐕' },
		{ group: 'fairy', icon: '🧚‍♀️' },
		{ group: 'plant', icon: '🌿' },
		{ group: 'dragon', icon: '🐲' },
		{ group: 'flying', icon: '🐦' },
		{ group: 'mineral', icon: '🪨' },
		{ group: 'monster', icon: '👾' },
		{ group: 'no-eggs', icon: '❌' },
		{ group: 'water-1', icon: '💧' },
		{ group: 'water-2', icon: '💧💧' },
		{ group: 'water-3', icon: '💦' },
		{ group: 'amorphous', icon: '🗯️' },
		{ group: 'human-like', icon: '👥' },
		{ group: 'undiscovered', icon: '❔' }
	];

	const egg_group = (): string =>
		egg.map((group) => egg_groups.find((g) => g.group === group)?.icon).join('');

	$: units = ['height', 'weight', 'steps', 'gender', 'rate', 'egg'].map((unit) =>
		$t(`unit.${unit}`)
	);

	$: scores = [
		{ score: (height / 10).toPrecision(2), unit: units[0], icon: '📏' },
		{ score: weight / 10, unit: units[1], icon: '⚖️' },
		{ score: steps * 255 + 1, unit: units[2], icon: '🦶' },
		{ score: `${(gender === -1 ? 0 : gender / 8) * 100}%`, unit: units[3], icon: '♀️' },
		{ score: `${rate}`, unit: units[4], icon: '🔴' },
		{ score: egg_group(), unit: units[5], icon: '🥚' }
	];
</script>

<Card title={$t('title.data-factors')} size="md" span="md" close_up>
	<div class="scores">
		{#each scores as { score, unit, icon }}
			<PokemonScore {score} {unit} {icon} />
		{/each}
	</div>
</Card>

<style>
	.scores {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 1rem;
		width: 100%;
		height: 100%;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		align-content: center;
		flex-direction: row;
		justify-items: stretch;
	}
</style>
