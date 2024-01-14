{#each [0, 1, 2, 3, 4, 5, 6, 7] as nbr}
	<span id="{nbr}-stage-next" />
{/each}

<style>
	span {
		display: flex;
		place-content: center;
		place-items: center;
		width: 100%;

		color: var(--background-color-___);
		background-color: var(--background-color-___);
		border-radius: var(--border-r-200) 0 0 var(--border-r-200);
		height: 1em;
	}
</style>
