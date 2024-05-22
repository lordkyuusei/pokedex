<script lang="ts">
	let topRightX: number = 75;
	let topRightY: number = 75;
	let topLeftX: number = 50;
	let topLeftY: number = 75;
	let botLeftX: number = 50;
	let botLeftY: number = 225;
	let botRightX: number = 75;
	let botRightY: number = 225;

	let clickedArea: string = null;

	function showExample(event: MouseEvent & { currentTarget: EventTarget & SVGPolygonElement }) {
		clickedArea = event.currentTarget.id;
	}

	function showExampleKeyboard(
		event: KeyboardEvent & { currentTarget: EventTarget & SVGPolygonElement }
	) {
		throw new Error('Function not implemented.');
	}
</script>

<section>
	<div style="display: flex; flex-direction: column;">
		<input type="range" min="0" max="500" bind:value={topRightX} />
		<input type="range" min="0" max="500" bind:value={topRightY} />
		<input type="range" min="0" max="500" bind:value={topLeftX} />
		<input type="range" min="0" max="500" bind:value={topLeftY} />
		<input type="range" min="0" max="500" bind:value={botLeftX} />
		<input type="range" min="0" max="500" bind:value={botLeftY} />
		<input type="range" min="0" max="500" bind:value={botRightX} />
		<input type="range" min="0" max="500" bind:value={botRightY} />
		{#if clickedArea !== null}
			Zone: {clickedArea}
		{/if}
	</div>
	<svg viewBox="0 0 500 500">
		<image href="/maps/red-blue-yellow-green.png"></image>
		<polygon
			id="victory-road"
			on:click={showExample}
			role="button"
			on:keypress={showExampleKeyboard}
			tabindex="0"
			points="{topLeftX},{topLeftY} {topRightX},{topRightY} {botRightX},{botRightY} {botLeftX},{botLeftY}"
		></polygon>

		<polygon
			id="victory-road"
			on:click={showExample}
			role="button"
			on:keypress={showExampleKeyboard}
			tabindex="0"
			points="{topLeftX + 50},{topLeftY + 150 - 25} {topRightX + 50},{topRightY +
				150 -
				25} {botRightX + 50},{botRightY + 100} {botLeftX + 50},{botLeftY + 100}"
		></polygon>
	</svg>
</section>

<style>
	section {
		display: grid;
		grid-template: 100% / auto auto;
		gap: 1rem;
	}
	image {
		width: 100%;
		image-rendering: pixelated;
	}

	polygon {
		fill: rgba(151, 0, 0, 0.3);
		cursor: pointer;
		animation: blink 1s cubic-bezier(0.075, 0.82, 0.165, 1) infinite;
	}

	@keyframes blink {
		50% {
			fill: rgb(255 255 255 / 0.3);
		}
	}
</style>
