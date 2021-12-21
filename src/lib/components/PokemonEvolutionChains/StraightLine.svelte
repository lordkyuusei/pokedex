<script lang="ts">
	import TriggerDetails from './TriggerDetails.svelte';

	export let props: any = {};
</script>

<div class="evolution_chain">
	<TriggerDetails {props} />
	<div class="straight_line" />
</div>

<style scoped>
	.evolution_chain {
		display: grid;
		height: 100%;
		width: 100%;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 0.5fr 1fr;
		align-items: center;
	}

	.straight_line {
		background-color: var(--theme-text);
		width: 100%;
		height: 10px;
		grid-row: 0;
	}
</style>
