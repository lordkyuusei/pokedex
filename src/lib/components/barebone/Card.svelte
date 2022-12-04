<script lang="ts">
	export let title: string = undefined;

	export let reactive: boolean = false;
	export let close_up: boolean = false;
</script>

<div class="card" class:reactive class:close_up>
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
		border-radius: 0.5rem;
		box-shadow: var(--theme-shadow);
		background-color: var(--theme-alt-background);
		transition: 0.2s ease-in-out;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}

	.card.reactive:hover {
		transform: translateY(-2px);
		box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
	}

	.close_up {
		padding: 1rem;
	}

	.header {
		display: flex;
		font-size: 0.75em;
		justify-content: center;
		align-items: center;
		width: fit-content;
		padding: 0 0.5em;
		border-radius: 0.5em;
		position: absolute;
		top: -10px;
		left: 10px;
		background-color: var(--theme-background);
		border: 1px solid var(--theme-border);
		z-index: 0;
		opacity: 0;
		transition: opacity 0.2s ease-out;
	}

	.card:hover > .header {
		opacity: 1;
		transition: opacity 0.2s ease-in;
	}
</style>
