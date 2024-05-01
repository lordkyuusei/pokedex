<script lang="ts">
	import _ from '$lib/store/i18n';
	import type { Route } from '$lib/types/meta';

	import GameSwitch from '$lib/components/layout/GameSwitch.svelte';
	import LangSwitch from '$lib/components/layout/LangSwitch.svelte';
	import Search from '$lib/components/layout/Search.svelte';
	import ThemeSwitch from '$lib/components/layout/ThemeSwitch.svelte';
	import PrevNextNavigation from '$lib/components/layout/PrevNextNavigation.svelte';

	export let routes: Route[];
	export let routeId: string | null = '';
	export let isDev: boolean;
	export let generationsList: any[];

	const controlIfSelected = (routeId: string | null, route: Route) => {
		if (!routeId) return false;

		const [_, group, path = '', ...rest] = routeId.split('/');
		return path.includes(route.id) || path.includes(route.alt_id);
	};
</script>

<section id="dex-layout">
	<aside id="dex-navigation">
		<header id="navigation-logo">
			<img src="/dex-logo.svg" alt="logo" />
		</header>
		<nav id="navigation-links">
			<menu class="links-texts">
				{#each routes as route (route.id)}
					<li class:selected={controlIfSelected(routeId, route)}>
						<a href={'/' + route.id}>{$_(route.name)}</a>
					</li>
				{/each}
				{#if isDev}
					<li class="admin">
						<a href="/admin">Admin</a>
					</li>
				{/if}
			</menu>
		</nav>
		<footer id="navigation-settings">
			<ThemeSwitch />
			<LangSwitch />
		</footer>
	</aside>
	<main id="dex-main">
		<header id="main-header">
			<PrevNextNavigation />
			<span>
				<GameSwitch {generationsList} />
				<Search />
			</span>
		</header>
		<section id="main-content">
			<slot />
		</section>
	</main>
</section>

<style>
	#dex-layout {
		display: grid;
		background-color: var(--background-color-____);
		color: var(--text-color);
		grid-template: 'aside main' var(--app-height) / var(--app-navigation-width) var(
				--app-content-width
			);

		& > #dex-navigation {
			grid-area: aside;
			display: grid;
			grid-template:
				'aside-logo' var(--layout-header-size)
				'aside-links' var(--layout-nav-size)
				'aside-settings' var(--layout-header-size) / 100%;

			& > :is(#navigation-logo, #navigation-settings) {
				display: flex;
				place-content: center;
				place-items: center;
			}

			& > #navigation-logo {
				& > img {
					inline-size: 75%;
				}
			}

			& > nav#navigation-links menu[class^='links'] {
				display: flex;
				flex-direction: column;
				align-items: center;
				list-style-type: none;
				padding-inline-start: 0;

				& > li {
					width: 100%;
					display: grid;
					align-items: center;
					border-block: 1px solid var(--background-color-_);
					transition: all var(--transition-duration) cubic-bezier(0.075, 0.82, 0.165, 1);

					&:not(:first-child) {
						border-top: 0;
					}

					&.selected {
						font-weight: bold;
						background-color: var(--background-color-__);
					}

					&:not(.selected) {
						opacity: 0.75;
						&:hover {
							opacity: initial;
							background-color: var(--background-color-___);
						}
					}

					& > a {
						text-align: center;
						text-transform: uppercase;
						letter-spacing: 0.1em;
						padding: var(--normal-gap) var(--small-gap);
						border-radius: 0;
					}
				}
			}

			& > #navigation-settings {
				gap: var(--smaller-gap);
			}
		}

		& > #dex-main {
			grid-area: main;

			display: grid;
			grid-template:
				'header' var(--layout-header-size)
				'content' var(--layout-content-size) / 100%;

			& > #main-header {
				height: 100%;
				display: flex;
				gap: var(--normal-gap);
				justify-content: space-between;
				align-items: center;
				padding-inline-end: 1em;
				border-bottom-right-radius: 1em;

				& > span {
					display: flex;
					gap: 1rem;
					align-items: center;
				}
			}

			& > #main-content {
				background-color: var(--background-color-___);
			}
		}
	}
</style>
