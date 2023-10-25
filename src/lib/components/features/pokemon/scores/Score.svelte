<script lang="ts">
	export let icon: string = '';
	export let unit: string = '';
</script>

<div class="score-card">
	<div class="score-icon">{icon}</div>
	<div class="score-value"><slot /></div>
	<div class="score-unit">{unit}</div>
</div>

<style>
	.score-card {
		height: 100%;
		padding-left: 1.5em;
		display: flex;
		gap: var(--small-gap);
		align-content: center;
		flex-direction: column;
		align-items: flex-start;
		justify-content: space-evenly;
		border-radius: var(--border-r-100) 0 var(--border-r-100) 0;
		background: var(--background-accent);
	}

	.score-icon {
		text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
	}

	.score-value {
		font-size: 1.25em;
		font-weight: bold;
	}

	.score-unit {
		font-size: 0.8em;
	}
</style>
