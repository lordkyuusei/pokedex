<script lang="ts">
	export let items: any[];
	export let name: string = "Items";
	export let checkedItems: string[] = [];
	
	let buttonRef: HTMLButtonElement;
</script>

<div class="select">
	<button bind:this={buttonRef}>{name}</button>
	<ul class="list">
		{#each items as item (item)}
		<li>
			<input id={item} type="checkbox" bind:group={checkedItems} name="items" value={item}>
			<span>{item}</span>
		</li>
		{/each}
	</ul>
</div>

<style>
	div.select {
		height: 100%;
		min-width: 10rem;
		position: relative;
		border: 1px solid var(--text-color);
		background-color: var(--background-second-color);
		z-index: 2;

		& > * {
			width: 100%;
		}

		& > button {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
			justify-content: center;

			border: 0;
			text-align: center;
			padding: 0.5rem 1rem;
		}

		& > ul {
			position: absolute;
			top: 100%;
			display: none;
			width: 100%;
			max-height: 25svh;
			overflow-y: auto;
			box-shadow: var(--box-shadow);
			border: 1px solid var(--text-color);
			z-index: 3;

			& > li {
				display: grid;
				grid-template: 100% / 100%;
				place-items: center;
				text-align: center;
				color: var(--text-color);
				border: 1px solid var(--text-color);
				background-color: var(--background-color);
				padding-inline: var(--small-gap);

				& > * {
					grid-area: 1 / 1;
				}

				&:has(> input:checked) {
					background: var(--text-color);
					color: var(--background-color);
				}

				& > span {
					pointer-events: none;
				}

				& > input {
					appearance: none;
					height: 100%;
					width: 100%;
					padding: 0;
					border: 0;
					margin: 0;
					cursor: pointer;
					background-color: transparent;
				}
			}
		}

		& > button:focus {
			border: 2px solid;
		}

		& > button:focus + ul,
		& > ul:has(input:focus),
		& > ul:hover {
			display: grid;
			grid-auto-flow: row;
			grid-auto-rows: 2rem;
		}
	}
</style>
