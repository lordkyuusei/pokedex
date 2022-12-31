<script>
	import TriggerDetails from './TriggerDetails.svelte';
	export let props;
</script>

<div class="evolution-chain">
	<TriggerDetails {props} />
	<div class="filler" />
</div>

<style>
	.evolution-chain {
		position: relative;
		display: grid;
		grid-template-rows: 1fr 0fr 1fr;
		height: 100%;
		width: 100%;
	}

	.evolution-chain::after {
		position: absolute;
		height: calc(50% + 5px);
		width: 10px;
		content: '';
		right: 0;
		left: 0;
		bottom: 0;
		border-width: 0 0 0 10px;
		border-style: solid;
		border-color: var(--theme-text);
		border-radius: var(--theme-border-r) 0 0 0;
	}

	.filler {
		background-color: var(--theme-text);
		width: 100%;
		height: 10px;
		border-radius: var(--theme-border-r) 0 0 0;
	}
</style>
