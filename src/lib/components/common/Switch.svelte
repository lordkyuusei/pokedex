<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let event: string = 'event';
	export let icon: string;

	let checked: boolean = false;
	const dispatch = createEventDispatcher();

	const setEvent = () => {
		checked = !checked;
		dispatch(event, {
			[event]: checked
		});
	};
	onMount(() => {});
</script>

<label for="{event}-switch" class="label" class:label-check={checked}>
	<input
		id="{event}-switch"
		title="Toggle {event} mode"
		aria-label="Toggle {event}- mode"
		type="checkbox"
		class="switch"
		class:checked
		on:click={setEvent}
	/>
	<section class="toggle-visual">
		<span class="toggle-block" class:toggle-check={checked} />
		<span
			class="toggle-image"
			class:image-check={checked}
			style:background="url('/icons/{icon}.png') no-repeat center/90%"
		/>
	</section>
</label>

<style>
	.label {
		position: relative;
		display: block;
		height: 2em;
		width: 4em;
		border-radius: var(--border-r-50);
		background-color: var(--background-color-___);
	}

	.label.label-check {
		background-color: var(--primary-color);
	}

	.label > .switch {
		position: absolute;
		opacity: 0;
		top: 0;
		left: 0;
		width: calc(100% - 0.5em);
	}

	.label > .toggle-visual {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.label > .toggle-visual > .toggle-block {
		position: absolute;
		top: 2px;
		left: 2px;
		height: calc(2em - 4px);
		width: calc(2em - 4px);
		background-color: var(--background-color-_);
		border-radius: var(--border-r-50);
		transition: all var(--transition-duration) var(--transition);
		z-index: 2;
		cursor: pointer;
	}

	.label.label-check > .toggle-visual > .toggle-block {
		background-color: var(--background-color-___);
	}

	.label > .toggle-visual > .toggle-block:hover {
		transform: scale(0.9);
	}

	.label > .toggle-visual > .toggle-block.toggle-check {
		transform: translateX(2em);
		transition: all var(--transition-duration) var(--transition);
	}

	.label > .toggle-visual > .toggle-image {
		position: absolute;
		top: 1px;
		right: 2px;
		height: calc(2em - 4px);
		width: calc(2em - 4px);
		transition: all var(--transition-duration) var(--transition);
		filter: brightness(0.4);
	}

	.label > .toggle-visual > .toggle-image.image-check {
		transform: translateX(-2em);
		transition: all var(--transition-duration) var(--transition);
		filter: none;
	}
</style>
