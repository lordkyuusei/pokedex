<script lang="ts">
	import PokemonScore from './Score.svelte';
	import EGG_GROUPS from '$lib/constants/egg_groups.json';
	import { fade } from 'svelte/transition';
	import t from '$lib/store/i18n';

	export let height: number = 0;
	export let weight: number = 0;
	export let steps: number = 0;
	export let gender: number = 0;
	export let rate: number = 0;
	export let egg: string[] = [];
	export let genus: string = 'Pokemon ???';
	export let description: string = $t('scores.no-desc');

	const drawBackground = () => {
		const femaleRatio = gender === -1 ? 0 : (gender / 8) * 360;
		const maleRatio = gender === -1 ? 0 : 360;
		return `conic-gradient(darkorchid 0deg ${femaleRatio}deg, dodgerblue ${femaleRatio}deg ${maleRatio}deg, slategray ${maleRatio}deg 360deg)`;
	};

	const getGenderCircle = (gender: number) => {
		const femaleMod = gender === -1 ? 0 : (gender / 8) * 100;
		const maleMod = gender === -1 ? 0 : 100 - (gender / 8) * 100;
		return `<div title="♀️${femaleMod}% ; ♂${maleMod}%" style="height: 2rem; aspect-ratio: 1; border-radius: 1rem; background: ${drawBackground()}"></div>`;
	};

	const egg_group = (): string =>
		egg.map((group) => EGG_GROUPS.find((g) => g.group === group)?.icon).join('');

	$: units = ['height', 'weight', 'steps', 'gender', 'rate', 'egg'].map((unit) => unit);

	$: scores = [
		{ score: `${rate}`, unit: units[4], icon: '🔴' },
		{ score: `${weight / 10} kg`, unit: units[1], icon: '⚖️' },
		{ score: `${(height / 10).toPrecision(2)} m`, unit: units[0], icon: '📏' },
		{
			score: getGenderCircle(gender),
			unit: units[3],
			icon: '⚧️%'
		},
		{ score: egg_group(), unit: units[5], icon: '🥚🗂️' },
		{ score: steps * 255 + 1, unit: units[2], icon: '🦶' },
	];
</script>

<section in:fade={{ delay: 150 }} id="pokemon-scores">
	<blockquote data-genus={genus}>
		<cite>
			« {description} »
		</cite>
	</blockquote>
	{#each scores as { score, unit, icon }, index}
		<PokemonScore {unit} {icon} {index}>{@html score}</PokemonScore>
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
		padding: var(--small-gap);
		box-shadow: var(--box-shadow);
		border-radius: var(--border-r-200) 0 var(--border-r-200) var(--border-r-50);
		background-color: var(--background-second-color);
	}

	@media (max-width: 640px) {
		#pokemon-scores {
			border-radius: 0;
			box-shadow: none;
		}
	}

	blockquote {
		height: 100%;
		grid-area: desc;
		display: flex;
		align-items: center;
		justify-content: center;
		white-space: normal;
		margin: 0;
		padding-inline: 1em;
		line-height: 1.5em;
		border-radius: var(--border-r-100) 0 var(--border-r-50) 0;
		background: var(--background-color);
		position: relative;

		&::before {
			content: attr(data-genus);
			position: absolute;
			top: calc(var(--small-gap) * -0.75);
			left: var(--small-gap);
			padding: 0 var(--small-gap);
		
			backdrop-filter: brightness(1.2);
			-webkit-backdrop-filter: brightness(1.2);
		
			color: var(--background-color);
			background-color: var(--text-color);
			border: 1px solid var(--text-color);
			border-radius: var(--border-r-50);
		}
	}

</style>
