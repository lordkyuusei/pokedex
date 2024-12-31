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
		border-radius: var(--border-r-200);
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
			hsl(from var(--accent-color) h calc(s/1.5) calc(l /4)) 50%,
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
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: var(--background-color);
				border: calc(var(--smallest-gap) / 2) solid var(--accent-color);

				& > a {
					position: relative;

					display: flex;
					justify-content: center;
					height: 100%;
					aspect-ratio: 1;
					text-transform: uppercase;
					border-radius: var(--border-r-200);

					&::before {
						position: absolute;
						content: attr(data-link);
						top: calc(-50% - var(--smaller-gap));
					}
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
					grid-area: 4 / 1 / 6 / 1;
				}
				&.button-1 {
					grid-area: 4 / 5 / 6 / 5;
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
				border: 2px solid var(--accent-color);
				border-radius: var(--app-width);
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
					grid-row: 3;
					grid-column: 5;
				}
				&.button-1 {
					grid-row: 3 / 5;
					grid-column: 3;
				}
				&.button-2 {
					grid-row: 3 / 5;
					grid-column: 7;

				}
				&.button-3 {
					grid-row: 4 / 6;
					grid-column: 1 / 3;
				}
				&.button-4 {
					grid-row: 4 / 6;
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
			height: 0;
			width: 100%;
			border: 0;
			border-top: 1px solid var(--accent-color);
			overflow: visible;

			&.toggled::after {
				box-shadow: 0px -1px 0px 0px hsl(from var(--accent-color) h s calc(l - 20));
			}

			&::after {
				content: '';
				position: absolute;
				width: 100%;
				height: var(--layout-header-size);
				background-color: var(--background-blur-second-color);
				box-shadow: 0px -1px 0px 0px var(--accent-color);
			}
		}

		& > #layout-button {
			display: grid;
			grid-template: 1fr / 1fr;
			place-items: center;
			position: relative;
			border: 3px solid var(--background-color);
			background-color: var(--accent-color);

			padding: 0;
			z-index: 2;

			&.toggled {
				border-color: var(--accent-color);
				background-color: var(--background-color);

				&::before {
					background-color: var(--accent-color);
				}

				&::after {
					box-shadow: inset 0px 0px 0px 3px var(--accent-color);
					background-color: var(--background-color);
				}
			}

			&::before,
			&::after {
				content: '';
				grid-area: 1 / 1;
			}

			&::before {
				height: 3px;
				width: 100%;
				background-color: var(--background-color);
			}

			&::after {
				height: 50%;
				aspect-ratio: 1;
				border-radius: var(--border-r-200);
				box-shadow: inset 0px 0px 0px 3px var(--background-color);
				background-color: var(--accent-color);
				z-index: 2;
			}
		}
	}
</style>
