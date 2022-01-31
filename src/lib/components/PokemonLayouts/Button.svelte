<script lang="ts">
	export let rounded: boolean = true;
	export let diamond: boolean = false;
	export let title: string = '';
	export let size: string = 'md';
</script>

<button class:rounded class:diamond class="button button-{size}" on:click {title}>
	<slot />
</button>

<style>
	.button {
		height: 2.5rem;
		margin: 0.5rem;
		color: var(--theme-background);
		border: 2px solid var(--theme-ternary);
		background-color: var(--theme-primary);
	}

	.button:hover {
		cursor: pointer;
	}

	.rounded {
		border-radius: 25px;
	}
	.diamond {
		/* clip the rectangle into a losange from left to right */
		clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
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
