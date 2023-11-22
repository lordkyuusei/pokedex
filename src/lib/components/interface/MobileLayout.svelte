<script lang="ts">
	import { browser } from '$app/environment';
	import _ from '$lib/store/i18n';
	import type { Route } from '$lib/types/meta';
	import GameSwitch from '../layout/GameSwitch.svelte';
	import LangSwitch from '../layout/LangSwitch.svelte';
	import Search from '../layout/Search.svelte';
	import ThemeSwitch from '../layout/ThemeSwitch.svelte';

	export let routes: Route[];
	export let generationsList: any[];

	let show: boolean = false;

	const toggleShow = () => (show = !show);
</script>

<main id="dex-layout">
	<section id="layout-content" class:opaque={show}>
		<GameSwitch {generationsList}></GameSwitch>
		<slot />
	</section>
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
</main>

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

	#dex-layout {
		display: grid;
		grid-template: 95svh 5svh / 100svw;
		background-color: var(--background-color-___);
		color: var(--text-color);
		transition: all 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);

		&:has(.opaque) {
			background-color: var(--background-color-___);
		}

		& > #layout-content {
			display: grid;
			grid-template: 7% 93% / 100%;
			&.opaque {
				filter: brightness(0.5);
				pointer-events: none;
			}
		}

		& > #layout-menu {
			position: absolute;
			overflow: hidden;
			bottom: 0;
			z-index: 1;

			display: grid;
			grid-template:
				'.' 5svh
				'menu-customization' 20svh
				'menu-features' 20svh
				'.' 5svh / 100%;
			height: 50%;
			width: 100%;
			background: linear-gradient(
				0deg,
				var(--background-color-___) 85%,
				var(--background-color-____) 95%,
				transparent 100%
			);
			transition: opacity 0.25s cubic-bezier(0.075, 0.82, 0.165, 1);

			&.show {
				opacity: 1;
			}

			&:not(.show) {
				opacity: 0;
				pointer-events: none;
				height: 0;
			}

			& > :is(#menu-customization, #menu-features) {
				position: relative;
				display: grid;
				place-items: center;

				& > .feature-button {
					position: relative;
					box-shadow: inset 0px 0px 0px 2px gold;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: var(--background-color-__);

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

				&::before {
					position: absolute;
					top: 25%;
					content: '';
					width: 120%;
					aspect-ratio: 1;
					border: 2px solid gold;
					border-radius: 50%;
				}
			}

			& > #menu-customization {
				grid-area: menu-customization;
				grid-template-columns: 1fr 1fr 1.25fr 1fr 1fr;
				grid-template-rows: 50% 20% 5%;

				& > .feature-button {
					&.button-0 {
						grid-area: 2 / 1 / 4 / 1;
					}
					&.button-1 {
						grid-area: 2 / 5 / 4 / 5;
					}
					&.button-2 {
						grid-area: 1 / 3;
					}
				}
			}

			& > #menu-features {
				grid-area: menu-features;
				grid-template-columns: 1fr 1fr 1.25fr 1fr 1fr;
				grid-template-rows: 50% 20% 5%;

				& > .feature-button {
					&.button-0 {
						grid-area: 1 / 3;
					}
					&.button-1 {
						grid-area: 1 / 2 / 3 / 2;
					}
					&.button-2 {
						grid-area: 1 / 4 / 3 / 4;
					}
					&.button-3 {
						grid-area: 2 / 1 / 4 / 1;
					}
					&.button-4 {
						grid-area: 2 / 5 / 4 / 5;
					}
				}
			}
		}

		& > #layout-action {
			display: grid;
			grid-template: 1% 99% / 100%;
			place-items: center;
			z-index: 2;

			& > .layout-line,
			& > #layout-button {
				grid-area: 1/1;
				transition: all var(--transition-duration) cubic-bezier(0.075, 0.82, 0.165, 1);
			}

			& > .layout-line {
				position: relative;
				width: 100%;
				height: 2px;
				border: 0;
				background-color: var(--background-color-__);
				overflow: visible;

				&.toggled {
					background-color: gold;
				}

				&::after {
					top: 2px;
					left: 0px;
					position: absolute;
					content: '';
					background-color: var(--background-color-___);
					height: 10svh;
					width: 100%;
				}
			}

			& > #layout-button {
				position: relative;
				z-index: 2;
				border: 2px solid var(--background-color-___);
				background-color: gold;

				&.toggled {
					border-color: gold;
					background-color: var(--background-color-___);

					&::before {
						background-color: gold;
					}

					&::after {
						box-shadow: inset 0px 0px 0px 3px gold;
						background-color: var(--background-color-___);
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
					background-color: var(--background-color-___);
				}

				&::after {
					height: 50%;
					top: calc(50% - 25%);
					left: calc(50% - 25%);
					aspect-ratio: 1;
					border-radius: 3rem;
					box-shadow: inset 0px 0px 0px 3px var(--background-color-___);
					background-color: gold;
				}
			}
		}
	}
</style>
