<script lang="ts">
	import PokemonScore from './Score.svelte';
	import EGG_GROUPS from '$lib/constants/egg_groups.json';
	import { fade } from 'svelte/transition';

	export let height: number = 0;
	export let weight: number = 0;
	export let steps: number = 0;
	export let gender: number = 0;
	export let rate: number = 0;
	export let genus: string = 'Pokemon ???';
	export let description: string = '';

	export let egg: string[] = [];

	const drawBackground = () => {
		const femaleRatio = gender === -1 ? 0 : (gender / 8) * 360;
		const maleRatio = gender === -1 ? 0 : 360;
		return `conic-gradient(darkorchid 0deg ${femaleRatio}deg, dodgerblue ${femaleRatio}deg ${maleRatio}deg, slategray ${maleRatio}deg 360deg)`;
	};

	const egg_group = (): string =>
		egg.map((group) => EGG_GROUPS.find((g) => g.group === group)?.icon).join('');

	$: units = ['height', 'weight', 'steps', 'gender', 'rate', 'egg'].map((unit) => unit);

	$: scores = [
		{ score: (height / 10).toPrecision(2), unit: units[0], icon: '📏' },
		{ score: weight / 10, unit: units[1], icon: '⚖️' },
		{ score: steps * 255 + 1, unit: units[2], icon: '🥚🦶' },
		{
			score: `<div
						title="♀️${gender === -1 ? 0 : (gender / 8) * 100}% ; ♂${
				gender === -1 ? 0 : 100 - (gender / 8) * 100
			}%"
						style="height: 2em;width: 2em;border-radius: 1em;background: ${drawBackground()}">
					</div>`,
			unit: units[3],
			icon: '⚧️%'
		},
		{ score: `${rate}`, unit: units[4], icon: '🔴' },
		{ score: egg_group(), unit: units[5], icon: '🥚🗂️' }
	];
</script>

<section in:fade={{ delay: 150 }} id="pokemon-scores">
	<p data-genus={genus}>{description}</p>
	{#each scores as { score, unit, icon }}
		<PokemonScore {unit} {icon}>{@html score}</PokemonScore>
	{/each}
</section>

<style>
	#pokemon-scores {
		display: grid;
		grid-template:
			'desc desc desc' 1fr
			'score score score' 1fr
			'score score score' 1fr / 1fr 1fr 1fr;

		gap: var(--small-gap);
		padding: 1em;
		border-radius: var(--border-r-200);
		background-color: var(--background-color);
		box-shadow: var(--box-shadow);
		grid-row: 2 / 5;
	}

	p {
		height: 100%;
		grid-area: desc;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: normal;
		margin: 0;
		padding-inline: 1em;
		line-height: 1.5em;
		border-radius: var(--border-r-100);
		background: var(--background-accent);
		position: relative;
	}

	p::before {
		content: attr(data-genus);
		position: absolute;
		top: -0.75em;
		left: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		padding: 0 0.5em;
		background-color: var(--background-color);
		border: 1px solid var(--text-color);
		border-radius: var(--border-r-50);
	}
</style>
