<script lang="ts">
	import { t } from '$lib/store/i18n/i18n';

	import Card from '../../barebone/Card.svelte';
	import PokemonScore from './PokemonScore.svelte';
	import { EGG_GROUPS } from '$lib/constants';

	export let height: number = 0;
	export let weight: number = 0;
	export let steps: number = 0;
	export let gender: number = 0;
	export let rate: number = 0;
	export let egg: string[] = [];

	const drawBackground = () => {
		const femaleRatio = gender === -1 ? 0 : (gender / 8) * 360;
		return `conic-gradient(darkorchid 0deg ${femaleRatio}deg, dodgerblue ${femaleRatio}deg 360deg`;
	};

	const egg_group = (): string =>
		egg.map((group) => EGG_GROUPS.find((g) => g.group === group)?.icon).join('');

	$: units = ['height', 'weight', 'steps', 'gender', 'rate', 'egg'].map((unit) =>
		$t(`unit.${unit}`)
	);

	$: scores = [
		{ score: (height / 10).toPrecision(2), unit: units[0], icon: '📏' },
		{ score: weight / 10, unit: units[1], icon: '⚖️' },
		{ score: steps * 255 + 1, unit: units[2], icon: '🥚🦶' },
		{
			score: `<div
						title="♀️${gender === -1 ? 0 : (gender / 8) * 100}% ; ♂${100 - (gender / 8) * 100}%"
						style="height: 2em;width: 2em;border-radius: 1em;background: ${drawBackground()}">
					</div>`,
			unit: units[3],
			icon: '♀️/♂%'
		},
		{ score: `${rate}`, unit: units[4], icon: '🔴' },
		{ score: egg_group(), unit: units[5], icon: '🥚🗂️' }
	];
</script>

<Card title={$t('title.data-factors')} close_up>
	<div class="scores">
		{#each scores as { score, unit, icon }}
			<PokemonScore {unit} {icon}>{@html score}</PokemonScore>
		{/each}
	</div>
</Card>

<style>
	.scores {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 0.75em;
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
