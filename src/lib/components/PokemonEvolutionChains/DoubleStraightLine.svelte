<script lang="ts">
	import TriggerDetails from './TriggerDetails.svelte';

	export let props;
</script>

<div class="evolution_chain">
	<TriggerDetails {props} />
	<div class="filler" />
</div>

<style scoped>
	.evolution_chain {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}

	.filler {
		width: 100%;
		height: calc(50% - 10px);
		border-radius: 25px 0px 0px 25px;
		border-color: var(--theme-text);
		border-style: solid;
		border-width: 10px 0 10px 10px;
		background-color: transparent;
	}
</style>
