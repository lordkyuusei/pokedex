<script lang="ts">
	import _ from '$lib/store/i18n';
	import type { Route } from '$lib/types/meta';

	import Search from '../layout/Search.svelte';
	import GameSwitch from '../layout/GameSwitch.svelte';
	import LangSwitch from '../layout/LangSwitch.svelte';
	import ThemeSwitch from '../layout/ThemeSwitch.svelte';

	export let routes: Route[];
	export let generationsList: any[];

	let show: boolean = false;

	const toggleShow = () => (show = !show);
</script>

<GameSwitch {generationsList}></GameSwitch>
<slot />
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
				<a
					title={$_(route.name)}
					href={'/' + route.id}
					on:click={() => toggleShow()}
					data-link={$_(route.name)}
				>
				</a>
			</li>
		{/each}
	</menu>
</nav>
<footer id="layout-action">
	<hr class="layout-line" class:toggled={show} />
	<button id="layout-button" class:toggled={show} on:click={() => toggleShow()} />
</footer>

<style>
	@media (max-width: 640px) {
		::-webkit-scrollbar {
			display: none;
		}
	}

	[class*='button'],
	[id*='button'] {
		height: 3rem;
		aspect-ratio: 1;
		border-radius: 2rem;
		cursor: pointer;
	}

	#layout-menu {
		width: 100%;
		height: 100%;

		display: grid;
		grid-template:
			'.' 1fr
			'menu-customization' 1fr
			'menu-features' 1fr / 100%;

		background: radial-gradient(
			circle at 50% 100%,
			var(--background-color) 50%,
			var(--background-blur-second-color) 100%
		);

		position: relative;
		overflow: hidden;
		z-index: 2;
		transition: opacity var(--transition-duration) var(--transition-function);

		&.show {
			opacity: 1;
		}

		&:not(.show) {
			opacity: 0;
			pointer-events: none;
			height: 0;
		}

		& > :is(#menu-customization, #menu-features) {
			display: grid;
			place-items: center;

			& > .feature-button {
				position: relative;
				box-shadow: inset 0px 0px 0px 2px gold;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: var(--background-second-color);

				& > a {
					display: flex;
					justify-content: center;
					position: relative;
					height: calc(100% - 2px);
					aspect-ratio: 1 / 1;
					text-transform: uppercase;

					padding: 0;
					border-radius: var(--border-r-200);

					&::before {
						position: absolute;
						content: attr(data-link);
						top: -50%;
					}
				}
				&.button-0 {
					grid-area: 2 / 1;
				}
				&.button-1 {
					grid-area: 1 / 2;
				}
				&.button-3 {
					grid-area: 2 / 4;
				}
				&.button-4 {
					grid-area: 2 / 5;
				}
			}
		}

		& > #menu-customization {
			--grid-cell-width: 5;
			--grid-cell-height: 5;

			grid-area: menu-customization;
			grid-template-columns: repeat(var(--grid-cell-width), calc(var(--app-width) / var(--grid-cell-width)));
			grid-template-rows: repeat(var(--grid-cell-height), calc(var(--layout-content-size) / var(--grid-cell-height)));
			grid-row: 2 / 4;
			overflow: hidden;

			& > .feature-button {
				&.button-0 {
					grid-area: 4 / 1 / 4 / 1;
				}
				&.button-1 {
					grid-area: 4 / 5 / 4 / 5;
				}
				&.button-2 {
					grid-area: 3 / 3 / 5 / 3;
				}
			}
		}

		& > #menu-features {
			--grid-cell-width: 9;
			--grid-cell-height: 6;

			grid-area: menu-features;
			grid-template-columns: repeat(var(--grid-cell-width), calc(var(--app-width) / var(--grid-cell-width)));
			grid-template-rows: repeat(var(--grid-cell-height), calc(var(--layout-content-size) / var(--grid-cell-height)));

			&::before, &::after {
				content: '';
				aspect-ratio: 1;
				border: 2px solid gold;
				border-radius: 50%;
			}
			
			&::before {
				grid-area: 5 / 1 / 5 / -1;
				width: calc(var(--app-width) + var(--normal-gap) * 5);
			}

			&::after {
				grid-area: 6 / 1 / 6 / -1;
				width: calc(var(--app-width) - var(--normal-gap));
			}

			& > .feature-button {
				&.button-0 {
					grid-row: 2 / 4;
					grid-column: 5;
				}
				&.button-1 {
					grid-row: 3;
					grid-column: 3;
				}
				&.button-2 {
					grid-row: 3;
					grid-column: 7;

				}
				&.button-3 {
					grid-row: 4;
					grid-column: 1 / 3;
				}
				&.button-4 {
					grid-row: 4;
					grid-column: 8 / -1;
				}
			}
		}
	}

	#layout-action {
		display: grid;
		grid-template: 1px 1fr / 100%;
		place-items: center;
		z-index: 2;

		& > .layout-line,
		& > #layout-button {
			grid-area: 1/1;
			transition: all var(--transition-duration) var(--transition-function);
		}

		& > .layout-line {
			position: relative;
			width: 100%;
			height: 2px;
			border: 0;
			background-color: var(--background-second-color);
			overflow: visible;

			&.toggled {
				background-color: gold;
			}

			&::after {
				top: 2px;
				left: 0px;
				position: absolute;
				content: '';
				background-color: var(--background-blur-second-color);
				height: 10svh;
				width: 100%;
			}
		}

		& > #layout-button {
			position: relative;
			z-index: 2;
			border: 2px solid var(--background-color);
			background-color: gold;

			&.toggled {
				border-color: gold;
				background-color: var(--background-color);

				&::before {
					background-color: gold;
				}

				&::after {
					box-shadow: inset 0px 0px 0px 3px gold;
					background-color: var(--background-color);
				}
			}

			&::before,
			&::after {
				position: absolute;
				content: '';
			}

			&::before {
				height: 5%;
				width: 100%;
				top: calc(50% - 2.5%);
				left: 0;
				background-color: var(--background-color);
			}

			&::after {
				height: 50%;
				top: calc(50% - 25%);
				left: calc(50% - 25%);
				aspect-ratio: 1;
				border-radius: 3rem;
				box-shadow: inset 0px 0px 0px 3px var(--background-color);
				background-color: gold;
			}
		}
	}
</style>
