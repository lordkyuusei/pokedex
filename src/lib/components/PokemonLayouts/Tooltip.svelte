<script lang="ts">
	import { onMount } from 'svelte';

	export let active: boolean = false;
	export let top: boolean = false;
	export let bottom: boolean = false;
	export let left: boolean = false;
	export let right: boolean = false;

	let innerWidth: number;
	let innerHeight: number;
	let scrollX: number;
	let scrollY: number;
	let activator: HTMLDivElement;
	let tooltip: HTMLSpanElement;

	const calcXOverflow = (calculatedLeft: number, width: number) => {
		const xOverflow = calculatedLeft + width - innerWidth + 12;
		let newLeft =
			(!left || right) && xOverflow > 0
				? Math.max(calculatedLeft - xOverflow, 0)
				: Math.max(calculatedLeft, 12);
		return newLeft + scrollX;
	};

	const calcYOverflow = (calculatedTop) => {
		const toTop = scrollY + innerHeight;
		const tooltipHeight = tooltip.offsetHeight;
		const totalHeight = calculatedTop + tooltipHeight;
		const isOverflowing = toTop < totalHeight;
		let newTop = calculatedTop;

		if (isOverflowing && activator.top > tooltipHeight) {
			newTop = scrollY + (activator.top - tooltipHeight);
		} else if (isOverflowing) {
			newTop = toTop - tooltipHeight - 12;
		} else if (calculatedTop < scrollY) {
			newTop = scrollY + 12;
		}
		return newTop < 12 ? 12 : newTop;
	};

	const calculateLeft = () => {
		const activatorLeft = activator.getBoundingClientRect().x + scrollX;
		let calculatedLeft = 0;
		if (top || bottom) {
			calculatedLeft = activatorLeft + activator.offsetWidth / 2 - tooltip.offsetWidth / 2;
		} else if (left || right) {
			calculatedLeft =
				activatorLeft + (right ? activator.offsetWidth : -tooltip.offsetWidth) + (right ? 10 : -10);
		}
		return `${calcXOverflow(calculatedLeft, tooltip.offsetWidth)}px`;
	};

	const calculateTop = () => {
		const activatorTop = activator.getBoundingClientRect().y + scrollY;
		let calculatedTop = 0;
		if (top || bottom) {
			calculatedTop =
				activatorTop +
				(bottom ? activator.offsetHeight : -tooltip.offsetHeight) +
				(bottom ? 10 : -10);
		} else if (left || right) {
			calculatedTop = activatorTop + activator.offsetHeight / 2 - tooltip.offsetHeight / 2;
		}
		return `${calcYOverflow(calculatedTop)}px`;
	};

	const updateTooltipPosition = () => {
		tooltip.style.left = calculateLeft();
		tooltip.style.top = calculateTop();
	};

	const handleResize = () => {
		if (active) {
			updateTooltipPosition();
		}
	};

	const handleActiveUpdate = () => ({ update: handleResize });

	onMount(() => {
		document.body.appendChild(tooltip);
		updateTooltipPosition();

		return () => {
			document.body.removeChild(tooltip);
		};
	});
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
	bind:scrollX
	bind:scrollY
	on:resize={handleResize}
/>

<!-- Slot for the element that display the tooltip -->
<div
	on:mouseenter={() => (active = true)}
	on:mouseleave={() => (active = false)}
	bind:this={activator}
	class="s-tooltip__wrapper"
>
	<slot />
</div>

<!-- Slot for the content of the tooltip -->
<span
	bind:this={tooltip}
	class="s-tooltip"
	class:active
	class:bottom
	class:top
	class:left
	class:right
	use:handleActiveUpdate={active}
>
	<slot name="tip" />
</span>

<style>
	.s-tooltip__wrapper {
		display: flex;
		cursor: pointer;
		width: 100%;
	}

	.s-tooltip {
		background-color: var(--theme-background);
		color: var(--theme-text);
		border-radius: 10px;
		z-index: 2;
		display: inline-block;
		padding: 1rem;
		position: absolute;
		text-transform: initial;
		text-align: center;
		width: auto;
		opacity: 0;
		pointer-events: none;
		transform-origin: center;
		transform: scale(0);
		transition-property: opacity, transform;
		transition-duration: 300ms, 0s;
		transition-delay: 0s, 300ms;
	}

	.s-tooltip.active {
		transform: scale(1);
		transition-property: transform, opacity;
		transition-duration: 300ms;
		transition-delay: 0s;
	}
</style>
