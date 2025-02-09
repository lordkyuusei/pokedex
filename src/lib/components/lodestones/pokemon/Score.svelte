<script lang="ts">
	import _ from '$lib/store/i18n';

	export let icon: string = '';
	export let unit: string = '';
	export let index: number = 0;
</script>

<div class="score-card nb-{index}">
	<header>
		<span class="score-unit">{$_(`scores.${unit}`)}</span>
		<span class="score-icon">{icon}</span>
	</header>
	<div class="score-value"><slot /></div>
</div>

<style>
	.score-card {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-content: center;
		justify-content: space-evenly;
		align-items: flex-start;
		gap: var(--small-gap);
		padding: var(--smallest-gap) var(--small-gap);
		background: var(--background-color);

		& > header {
			display: flex;
			justify-content: space-between;
			width: 100%;

			& > .score-unit {
				font-size: small;
			}
		}

		& > .score-value {
			font-size: x-large;
			font-weight: bold;
		}

		&.nb-0 { border-radius: calc(var(--border-r-100) - var(--small-gap)) 0 0 0; }
		&.nb-1 { border-radius: 0 0 0 0; }
		&.nb-2 { border-radius: 0 calc(var(--border-r-100) - var(--small-gap)) 0 0; }
		&.nb-3 { border-radius: 0 0 0 calc(var(--border-r-100) - var(--small-gap)); }
		&.nb-4 { border-radius: 0 0 0 0; }
		&.nb-5 { border-radius: 0 0 calc(var(--border-r-200) - var(--small-gap)) 0; }
	}
</style>
