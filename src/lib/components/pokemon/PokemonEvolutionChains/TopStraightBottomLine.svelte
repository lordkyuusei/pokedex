<script>
	import TriggerDetails from './TriggerDetails.svelte';
	export let props;
</script>

<div class="evolution_chain">
	<TriggerDetails {props} />
	<div class="straight-line" />
</div>

<style>
	.evolution_chain {
		display: grid;
		grid-template-rows: 1fr 0fr 1fr;
		height: 100%;
		width: calc(100% - 10px);
		border-style: solid;
		border-width: 0 0 0 10px;
		border-color: var(--theme-text);
	}

	.straight-line {
		background-color: var(--theme-text);
		width: 100%;
		height: 10px;
	}
</style>
