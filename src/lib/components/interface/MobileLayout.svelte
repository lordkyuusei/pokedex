<script lang="ts">
	import _ from '$lib/store/i18n';
	import LangSwitch from '../layout/LangSwitch.svelte';
	import Search from '../layout/Search.svelte';
	import ThemeSwitch from '../layout/ThemeSwitch.svelte';

	type Route = {
		id: string;
		alt_id: string;
		name: string;
	};

	export let routes: Route[];
	export let generationsList: any[];

	let show: boolean = false;

	const toggleShow = () => (show = !show);
</script>

<section id="dex-layout">
	<div class:opaque={show}>
		<slot />
	</div>
	<nav id="layout-menu" class:show>
		<menu id="menu-customization">
			<li class="feature-button button-0">
				<ThemeSwitch />
			</li>
			<li class="feature-button button-1">
				<LangSwitch />
			</li>
			<li class="feature-button button-2">
				<Search />
			</li>
		</menu>
		<menu id="menu-features">
			{#each routes as route, i (route.id)}
				<li class="feature-button button-{i}">
					<a href={route.id} on:click={() => toggleShow()}>{$_(route.name)}</a>
				</li>
			{/each}
		</menu>
	</nav>
	<footer id="layout-action">
		<hr class="layout-line" class:toggled={show} />
		<button id="layout-button" class:toggled={show} on:click={() => toggleShow()} />
	</footer>
</section>

<style>
	[class*='button'],
	[id*='button'] {
		height: 3rem;
		aspect-ratio: 1;
		border-radius: 2rem;
		cursor: pointer;
	}

	#dex-layout {
		display: grid;
		grid-template: 90svh 10svh / 100svw;
		background-color: var(--background-color);
		color: var(--text-color);
	}

	#dex-layout:has(.opaque) {
		background-color: var(--background-alt-color);
	}

	#dex-layout > .opaque {
		filter: brightness(0.5);
	}

	#dex-layout > #layout-menu {
		position: absolute;
		display: grid;
		grid-template:
			'.' calc(3rem + 2 * 2rem)
			'menu-customization' 1fr
			'menu-features' 1fr
			'.' calc(3rem + 2 * 0.5rem) / 100svw;
		height: 50%;
		width: 100%;
		z-index: 1;
		bottom: 0;
		background: linear-gradient(
			0deg,
			var(--background-color) 80%,
			var(--background-fade-alt-color) 100%
		);
		transition: opacity 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	#dex-layout > #layout-menu::before,
	#dex-layout > #layout-menu::after {
		z-index: -1;
		content: '';
		position: absolute;
		left: 50%;
		aspect-ratio: 1;
		border: 2px solid gold;
		border-top-left-radius: 50%;
		border-top-right-radius: 50%;
		border-bottom: 0;
		transform: translateX(-50%);
		background-color: transparent;
	}

	#dex-layout > #layout-menu::before {
		height: 120%;
		bottom: -46%;
	}

	#dex-layout > #layout-menu::after {
		height: 105%;
		bottom: -64%;
	}

	#dex-layout > #layout-menu:not(.show) {
		opacity: 0;
		pointer-events: none;
	}

	#dex-layout > #layout-menu.show {
		opacity: 1;
	}

	#dex-layout > #layout-menu > #menu-customization {
		display: grid;
		grid-area: menu-customization;
	}

	#dex-layout > #layout-menu > #menu-features {
		display: grid;
		grid-area: menu-features;
	}

	#dex-layout > #layout-menu > :is(#menu-customization, #menu-features) {
		place-items: center;
		grid-template-rows: repeat(2, 3svh);
	}

	#dex-layout > #layout-menu > #menu-customization {
		grid-template-columns: 1fr 0.2fr 1fr;
	}

	#dex-layout > #layout-menu > #menu-features {
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 5svh);
	}

	#dex-layout > #layout-menu > :is(#menu-customization, #menu-features) > .feature-button {
		position: relative;
		background-color: var(--background-alt-color);
		box-shadow: inset 0px 0px 0px 2px gold;
		display: flex;
		justify-content: center;
	}

	#dex-layout > #layout-menu > :is(#menu-customization, #menu-features) > .feature-button.button-0 {
		grid-column: 1;
		grid-row: 2;
	}

	#dex-layout > #layout-menu > :is(#menu-customization, #menu-features) > .feature-button.button-1 {
		grid-column: 2;
		grid-row: 1;
	}

	#dex-layout > #layout-menu > #menu-customization > .feature-button.button-2 {
		grid-column: 3;
		grid-row: 2;
	}

	#dex-layout > #layout-menu > #menu-features > .feature-button.button-2 {
		grid-column: 3;
		grid-row: 1;
	}

	#dex-layout > #layout-menu > :is(#menu-customization, #menu-features) > .feature-button.button-3 {
		grid-column: 4;
		grid-row: 2;
	}

	#dex-layout > #layout-menu > :is(#menu-customization, #menu-features) > .feature-button > a {
		position: absolute;
		top: -1.5rem;
		height: calc(100% + 1.5rem);
		text-transform: uppercase;
	}

	#dex-layout > #layout-action {
		display: grid;
		grid-template: 100% / 100%;
		place-items: center;
		z-index: 2;
	}

	#dex-layout > #layout-action > .layout-line {
		grid-column: 1;
		grid-row: 1;
		width: 100%;
		height: 4px;
		border: 0;
		background-color: var(--background-alt-color);
	}

	#dex-layout > #layout-action > .layout-line.toggled {
		background-color: gold;
	}

	#dex-layout > #layout-action > #layout-button {
		position: relative;
		grid-column: 1;
		grid-row: 1;
		border: 3px solid var(--background-alt-color);
		background-color: gold;
		z-index: 2;
	}

	#dex-layout > #layout-action > #layout-button.toggled {
		border-color: gold;
		background-color: var(--background-alt-color);
	}

	#dex-layout > #layout-action > #layout-button::before,
	#dex-layout > #layout-action > #layout-button::after {
		position: absolute;
		content: '';
	}

	#dex-layout > #layout-action > #layout-button::before {
		height: 10%;
		width: 100%;
		top: calc(50% - 5%);
		left: 0;
		background-color: var(--background-alt-color);
	}

	#dex-layout > #layout-action > #layout-button.toggled::before {
		background-color: gold;
	}

	#dex-layout > #layout-action > #layout-button::after {
		height: 50%;
		top: calc(50% - 25%);
		left: calc(50% - 25%);
		aspect-ratio: 1;
		border-radius: 3rem;
		box-shadow: inset 0px 0px 0px 3px var(--background-alt-color);
		background-color: gold;
	}

	#dex-layout > #layout-action > #layout-button.toggled::after {
		box-shadow: inset 0px 0px 0px 3px gold;
		background-color: var(--background-alt-color);
	}
</style>
