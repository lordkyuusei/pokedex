<script lang="ts">
	import _ from '$lib/store/i18n';
	import type { Route } from '$lib/types/meta';

	import GameSwitch from '$lib/components/layout/GameSwitch.svelte';
	import LangSwitch from '$lib/components/layout/LangSwitch.svelte';
	import PokemonDynamicHeader from '$lib/components/layout/PokemonDynamicHeader.svelte';
	import Search from '$lib/components/layout/Search.svelte';
	import ThemeSwitch from '$lib/components/layout/ThemeSwitch.svelte';

	export let routes: Route[];
	export let routeId: string | null = '';
	export let isDev: boolean;
	export let generationsList: any[];

	const controlIfSelected = (routeId: string | null, route: Route) => {
		if (!routeId) return false;

		const [_, group, path, ...rest] = routeId.split('/');
		console.log(path, route.id, route.alt_id);
		return path.includes(route.id) || path.includes(route.alt_id);
	};
</script>

<section id="dex-layout">
	<sidebar id="dex-navigation">
		<header id="navigation-logo">
			<img src="/dex-logo.svg" alt="logo" />
		</header>
		<nav id="navigation-links">
			<menu class="links-texts">
				{#each routes as route (route.id)}
					<li class:selected={controlIfSelected(routeId, route)}>
						<a href={route.id}>{$_(route.name)}</a>
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
	</sidebar>
	<main id="dex-main">
		<header id="main-header">
			<PokemonDynamicHeader />
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
		background-color: var(--background-color);
		color: var(--text-color);
		grid-template: 'sidebar main' 100svh / 150px auto;

		& > #dex-navigation {
			grid-area: sidebar;
			display: grid;
			grid-template:
				'sidebar-logo' 10svh
				'sidebar-links' 80svh
				'sidebar-settings' 10svh / auto;

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
					place-content: center;
					border-block: 1px solid var(--background-alt-color);
					transition: all var(--transition-duration) cubic-bezier(0.075, 0.82, 0.165, 1);

					&:not(:first-child) {
						border-top: 0;
					}

					&.selected {
						font-weight: bold;
						background-color: var(--background-alt-color);
					}

					&:not(.selected) {
						filter: brightness(0.5);

						&:hover {
							filter: initial;
							background-color: var(--background-fade-alt-color);
						}
					}

					& > a {
						display: block;
						width: 100%;
						text-align: end;
						text-transform: uppercase;
						letter-spacing: 0.2em;
						padding: var(--normal-gap) var(--small-gap);
					}
				}
			}

			& > #navigation-settings {
				gap: var(--normal-gap);
			}
		}

		& > #dex-main {
			grid-area: main;

			display: grid;
			grid-template: 'header' var(--layout-header-size) 'content' var(--layout-content-size) / 100%;

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
				}
			}

			& > #main-content {
				border-radius: var(--border-r-100) 0 0 0;
				background-color: var(--background-alt-color);
			}
		}
	}
</style>
