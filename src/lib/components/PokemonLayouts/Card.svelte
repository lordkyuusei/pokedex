<script lang="ts">
	export let title: string = undefined;

	export let reactive: boolean = false;
	export let close_up: boolean = false;
	export let size: string = 'sm';
	export let span: string = 'sm';
</script>

<div class="card card-w-{span} card-h-{size}" class:reactive class:close_up>
	{#if title}
		<div class="header">{title}</div>
	{/if}
	<slot />
</div>

<style>
	.card {
		margin: 0.5rem;
		border-radius: 10px;
		box-shadow: var(--theme-shadow);
		border: 1px solid var(--theme-border);
		background-color: var(--theme-alt-background);
		transition: 0.2s ease-in-out;
		box-sizing: border-box;
		position: relative;
	}

	.card.reactive:hover {
		transform: translateY(-2px);
		box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
	}

	.close_up {
		padding: 0.5em;
	}

	.header {
		display: flex;
		justify-content: center;
		align-items: center;
		width: fit-content;
		height: 0.8rem;
		padding: 0.2rem;
		border-radius: 10px;
		position: absolute;
		top: -10px;
		left: 10px;
		background-color: var(--theme-background);
		border: 1px solid var(--theme-border);
	}

	/* mobile small */
	@media screen and (max-width: 320px) {
		.card-w-xs,
		.card-w-sm,
		.card-w-md,
		.card-w-lg,
		.card-w-xl {
			width: 100%;
		}

		.card-h-sm {
			height: 20vh;
		}

		.card-h-md {
			height: 30vh;
		}

		.card-h-lg,
		.card-h-xl {
			height: 45vh;
		}
	}

	@media screen and (min-width: 320px) and (max-width: 375px) {
		.card-w-xs {
			width: 80%;
		}

		.card-w-sm,
		.card-w-md,
		.card-w-lg,
		.card-w-xl {
			width: 100%;
		}

		.card-h-sm {
			height: 20vh;
		}

		.card-h-md {
			height: 35vh;
		}

		.card-h-lg,
		.card-h-xl {
			height: 45vh;
		}
	}

	@media screen and (min-width: 375px) and (max-width: 425px) {
		.card-w-xs {
			width: 60%;
		}

		.card-w-sm {
			width: 80%;
		}

		.card-w-md,
		.card-w-lg,
		.card-w-xl {
			width: 90%;
		}

		.card-h-sm {
			height: 20vh;
		}

		.card-h-md {
			height: 30vh;
		}

		.card-h-lg,
		.card-h-xl {
			height: 45vh;
		}
	}
	@media screen and (min-width: 425px) and (max-width: 768px) {
		.card-w-xs {
			width: 40%;
		}

		.card-w-sm {
			width: 60%;
		}

		.card-w-md,
		.card-w-lg,
		.card-w-xl {
			width: calc(100% - 1rem);
		}

		.card-h-sm {
			height: 25vh;
		}

		.card-h-md {
			height: 40vh;
		}

		.card-h-lg {
			height: 55vh;
		}

		.card-h-xl {
			height: 70vh;
		}
	}
	@media screen and (min-width: 768px) and (max-width: 1024px) {
		.card-w-xs {
			width: 20%;
		}

		.card-w-sm {
			width: 40%;
		}

		.card-w-md {
			min-width: calc(30% - 1rem);
			width: fit-content;
			max-width: calc(45% - 1rem);
		}

		.card-h-md {
			min-height: 20vh;
			height: 25vh;
			max-height: 30vh;
		}

		.card-w-lg {
			min-width: calc(55% - 1rem);
			width: fit-content;
			max-width: calc(70% - 1rem);
		}

		.card-w-xl {
			width: 100%;
		}
	}
</style>
