<script lang="ts">
	import _ from '$lib/store/i18n';
	import type { Route } from '$lib/types/meta';

	import GameSwitch from '$lib/components/lodestones/GameSwitch.svelte';
	import LangSwitch from '$lib/components/lodestones/LangSwitch.svelte';
	import Search from '$lib/components/lodestones/Search.svelte';
	import ThemeSwitch from '$lib/components/lodestones/ThemeSwitch.svelte';
	import PrevNextNavigation from '$lib/components/lodestones/PrevNextNavigation.svelte';
	import ThemeVariantSwitch from '../lodestones/ThemeVariantSwitch.svelte';

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
		<ThemeVariantSwitch />
		<ThemeSwitch />
		<LangSwitch />
	</footer>
</aside>
<main id="dex-main">
	<header id="main-header">
		<PrevNextNavigation />
		{#await import('$lib/components/lodestones/UpdateSW.svelte') then { default: UpdateSW }}
			<UpdateSW />
		{/await}
		<GameSwitch {generationsList} />
		<Search />
	</header>
	<section id="main-content">
		<slot />
	</section>
</main>

<style>
	aside#dex-navigation,
	#dex-main > #main-header {
		background-color: var(--background-second-color);
	}

	aside#dex-navigation {
		grid-area: aside;
		display: grid;
		grid-template:
			'aside-logo' var(--layout-header-size)
			'aside-links' var(--layout-nav-size)
			'aside-settings' var(--layout-header-size) / 100%;

		z-index: 1;
		justify-items: center;
		box-shadow: var(--box-shadow);

		@media (max-width: 1024px) {
			grid-template:
				'aside-logo' var(--layout-header-size)
				'aside-links' calc(var(--layout-nav-size) - var(--layout-header-size))
				'aside-settings' calc(var(--layout-header-size) * 2) / 100%;
		}

		& > #navigation-logo {
			display: flex;
			place-content: center;
			place-items: center;
		}

		& > #navigation-logo img {
			width: calc(100% - var(--small-gap));
		}

		& > nav#navigation-links {
			width: 100%;

			& menu[class^='links'] {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-inline-start: 0;
				overflow-x: hidden;

				& > li {
					width: 100%;
					display: grid;
					align-items: center;
					transition: all var(--transition-duration) cubic-bezier(0.075, 0.82, 0.165, 1);

					&.selected {
						font-weight: bold;
						backdrop-filter: brightness(1.4);
						-webkit-backdrop-filter: brightness(1.4);
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
		}

		& > #navigation-settings {
			display: grid;
			grid-template: auto 1fr / 1fr auto;
			place-items: center;
			gap: var(--smaller-gap);
			padding-inline: var(--smallest-gap);

			@media (min-width: 1024px) {
				& > *:first-child {
					grid-area: 1 / 1 / 1 / span 2;
				}
			}

			@media (max-width: 1024px) {
				grid-template: 1fr 1fr 1fr / 100%;
			}
		}
	}

	#dex-main {
		grid-area: main;

		display: grid;
		grid-template:
			'header' var(--layout-header-size)
			'content' var(--layout-content-size) / 100%;

			& > #main-header {
				display: grid;
				grid-template: 100% / 1fr auto auto auto;
				justify-content: space-between;
				gap: var(--small-gap);
				align-items: center;
				padding-inline-end: var(--small-gap);
				padding-block: var(--smaller-gap);
				z-index: 3;
				box-shadow: var(--box-shadow);
			}

		& > #main-content {
			height: 100%;
			background-color: var(--background-color);
		}
	}
</style>
