<script lang="ts">
	export let full = false;
	export let huge = false;
	export let half = false;
	export let cover = false;
	export let slim = false;
	export let scp = false;
	export let quarter = false;
	export let reactive = false;
	export let big = false;

	export let title: string = undefined;
</script>

<div
	class="card"
	class:full
	class:huge
	class:half
	class:quarter
	class:cover
	class:slim
	class:scp
	class:reactive
	class:big
>
	{#if title}
		<div class="header">{title}</div>
	{/if}
	<slot />
</div>

<style>
	.card {
		height: 40vh;
		width: 18rem;
		margin: 0.5rem;
		padding: 0.5rem;
		border-radius: 10px;
		box-shadow: var(--theme-shadow);
		border: 1px solid var(--theme-border);
		transition: 0.2s ease-in-out;
		box-sizing: border-box;
		position: relative;
	}

	.full {
		width: 100%;
	}

	.half {
		width: calc(50% - 0.2rem);
	}

	.quarter {
		width: 25%;
	}

	.huge {
		height: 80vh;
	}

	.big {
		height: 60vh;
	}

	.slim {
		height: 20vh;
	}

	.cover {
		padding: 0;
	}

	.scp {
		width: auto;
	}

	.card.reactive:hover {
		transform: translateY(-2px);
		box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
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

	@media screen and (max-width: 720px) {
		.full,
		.half,
		.quarter {
			width: calc(100% - 0.2rem);
		}

		.scp {
			max-width: calc(100% - 0.2rem);
		}
	}
</style>
