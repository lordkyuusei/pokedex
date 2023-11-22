<script lang="ts">
	import _ from '$lib/store/i18n';

	export let icon: string = '';
	export let unit: string = '';
</script>

<div class="score-card">
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
		padding-inline: var(--small-gap);
		padding-block: var(--smallest-gap);
		background: var(--background-color-_);
		border-radius: var(--border-r-100) 0 var(--border-r-100) 0;

		& > header {
			display: flex;
			justify-content: space-between;
			width: 100%;

			& > .score-icon {
				text-shadow:
					-1px 0 black,
					0 1px black,
					1px 0 black,
					0 -1px black;
			}
			& > .score-unit {
				font-size: small;
			}
		}
		& > .score-value {
			font-size: x-large;
			font-weight: bold;

			text-shadow:
				-1px 0 black,
				0 1px black,
				1px 0 black,
				0 -1px black;
		}
	}
</style>
