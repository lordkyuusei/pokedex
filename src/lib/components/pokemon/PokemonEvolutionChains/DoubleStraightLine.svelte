<script lang="ts">
	import TriggerDetails from './TriggerDetails.svelte';

	export let props;
</script>

<div class="evolution_chain">
	<div class="trigger">
		<TriggerDetails {props} />
	</div>
	<div class="filler" />
</div>

<style>
	.evolution_chain {
		display: grid;
		align-items: center;
		grid-template-columns: 100%;
		grid-template-rows: 100%;
		height: 100%;
		width: 100%;
	}

	.filler,
	.trigger {
		grid-column: 1;
		grid-row: 1;
	}
	.filler {
		width: 100%;
		height: calc(50% - 10px);
		border-radius: var(--theme-border-r) 0px 0px var(--theme-border-r);
		border-color: var(--theme-text);
		border-style: solid;
		border-width: 10px 0 10px 10px;
		background-color: transparent;
	}
</style>
