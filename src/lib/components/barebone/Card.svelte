<script lang="ts">
	export let title: string = undefined;

	export let close_up: boolean = false;
	export let transparent: boolean = false;
</script>

<div class="card" class:close_up class:transparent>
	{#if title}
		<div class="header">{title}</div>
	{/if}
	<slot />
</div>

<style>
	.card {
		height: 100%;
		width: 100%;
		max-width: calc(100vw - 0.75rem);
		min-width: 200px;
		border-radius: var(--theme-border-r);
		box-shadow: var(--theme-shadow);
		background-color: var(--theme-alt-background);
		transition: 0.2s ease-in-out;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.close_up {
		padding: 1rem;
	}

	.transparent {
		background-color: transparent;
		box-shadow: none;
	}

	.header {
		display: flex;
		font-size: 0.75em;
		justify-content: center;
		align-items: center;
		width: fit-content;
		padding: 0 0.5em;
		border-radius: var(--theme-border-r);
		position: absolute;
		top: -10px;
		left: 10px;
		background-color: var(--theme-background);
		border: 1px solid var(--theme-border);
		z-index: 1;
		opacity: 0;
		transition: opacity 0.2s ease-out;
	}

	.card:hover > .header {
		opacity: 1;
		transition: opacity 0.2s ease-in;
	}
</style>
