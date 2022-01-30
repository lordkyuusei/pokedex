<script lang="ts">
	export let rounded: boolean = true;
	export let title: string = '';
	export let size: string = 'md';
</script>

<button class:rounded class="button button-{size}" {title}>
	<slot />
</button>

<style>
	.button {
		height: 2.5rem;
		color: var(--theme-background);
		border: 2px solid var(--theme-ternary);
		background: var(--theme-secondary);
	}
	.rounded {
		border-radius: 25px;
	}
	.button-lg {
		width: 8rem;
	}
	.button-md {
		width: 7rem;
	}
	.button-sm {
		width: 4rem;
	}
	.button-xs {
		width: 2rem;
	}
</style>
