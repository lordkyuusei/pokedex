<script lang="ts">
	export let full = false;
	export let huge = false;
	export let half = false;
	export let cover = false;
	export let slim = false;
	export let scp = false;
	export let quarter = false;
</script>

<div class="card" class:full class:huge class:half class:quarter class:cover class:slim class:scp>
	<slot />
</div>

<style scoped>
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
	}

	.full {
		width: 100%;
	}

	.huge {
		height: 80vh;
	}

	.slim {
		height: 20vh;
	}

	.half {
		width: calc(50% - 0.2rem);
	}

	.quarter {
		width: 25%;
	}

	.cover {
		padding: 0;
	}

	.scp {
		width: auto;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
	}
</style>
