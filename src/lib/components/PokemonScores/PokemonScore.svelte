<script lang="ts">
	export let score: string | number = 0;
	export let icon: string = '';
	export let unit: string = '';
</script>

<div class="score-card">
	<div class="score-icon">{icon}</div>
	<div class="score-value">{score}</div>
	<div class="score-unit">{unit}</div>
</div>

<style>
	.score-card {
		height: 100%;
		display: flex;
		border-radius: 10px;
		padding-left: 0.5rem;
		align-content: center;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-evenly;
		background: var(--theme-background);
		border: 1px solid var(--theme-background);
	}

	.score-icon {
		font-size: 1rem;
		text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
	}

	.score-value {
		font-size: 1.5em;
		font-weight: bold;
		margin-top: 0.5em;
	}

	.score-unit {
		font-size: 0.8em;
		margin-top: 0.5em;
	}
</style>
