<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	import { t } from '$lib/store/i18n/i18n';
	import ThemeContext from '$lib/contextes/ThemeContext.svelte';
	import PokedexSearch from '$lib/components/shared/Search.svelte';
	import LangToggle from '$lib/components/shared/Lang.svelte';
	import PokedexThemeToggle from '$lib/components/shared/Theme.svelte';
	import logo from '$lib/assets/favicon.png';
	import { routesList, pokemonList } from './routes';
	import SettingsToggle from '$lib/components/shared/Settings.svelte';

	let routes: any[] = [];

	onMount(() => {
		routes = routesList.filter((route) => (dev ? true : route.name !== 'experiments'));
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ThemeContext>
	<div id="kyuudex">
		<header id="kyuudex-header">
			<header class="header-logo">
				<img src={logo} alt="Beast ball logo" height="100%" width="100%" />
				<a href="/">KYUUDEX</a>
			</header>
			<section class="header-search">
				<PokedexSearch />
			</section>
			<footer class="header-footer">
				<ul class="navigation">
					{#each routes as route}
						<li class="navigation-item" class:invisible={route.icon === 'skip'}>
							<a href={route.path} class="navigation-link">
								{$t(route.name)}
							</a>
						</li>
					{/each}
				</ul>
			</footer>
		</header>
		<aside id="kyuudex-sidebar" />
		<main id="kyuudex-main">
			<slot />
		</main>
		<footer id="kyuudex-footer">
			<SettingsToggle />
			<LangToggle />
			<PokedexThemeToggle />
		</footer>
	</div>
</ThemeContext>

<style>
	#kyuudex {
		display: grid;
		grid-template-areas:
			'header header header header header'
			'sidebar main main main main'
			'footer main main main main';
		grid-template-rows: 1.5fr minmax(auto, 30fr) 1.5fr;
		grid-template-columns: 1fr minmax(auto, 9fr);
		height: 100vh;
	}

	#kyuudex-header {
		display: grid;
		grid-template-areas: 'logo search links';
		grid-template-rows: 1fr;
		grid-template-columns: 1fr 4fr 4fr;
		gap: 1em;
		grid-area: header;
		align-items: center;
		border-bottom-right-radius: 1.5rem;
		background: var(--theme-light-background);
		min-height: 3em;
	}

	#kyuudex-header > .header-logo {
		grid-area: logo;
		font-size: xx-large;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	#kyuudex-header > .header-logo > img {
		inline-size: 20%;
	}

	#kyuudex-header > .header-search {
		grid-area: search;
		position: relative;
	}

	#kyuudex-header > .header-footer {
		grid-area: links;
	}

	#kyuudex-header > .header-footer > .navigation {
		display: flex;
		justify-content: flex-end;
		gap: 5rem;
		list-style: none;
		font-size: larger;
		margin-right: 2rem;
		letter-spacing: 4px;
		text-transform: uppercase;
		margin-block: 0;
		padding-inline: 0;
	}

	#kyuudex-header > .header-footer > .navigation > .navigation-item {
		border-bottom: 2px solid transparent;
	}

	#kyuudex-header > .header-footer > .navigation > .navigation-item:hover {
		border-bottom-color: var(--theme-text);
		transition: border 0.2s ease-in-out;
	}

	#kyuudex-sidebar {
		grid-area: sidebar;
		position: relative;
		background: var(--theme-light-background);
		z-index: 2;
	}

	#kyuudex-main {
		grid-area: main;
		background: var(--theme-background);
		padding: 1rem 1rem 2.5rem;
		position: relative;
		overflow: auto;
	}

	#kyuudex-sidebar::before,
	#kyuudex-sidebar::after {
		content: '';
		position: absolute;
		height: 2rem;
		width: 2rem;
		right: -32px;
	}

	#kyuudex-sidebar::before {
		background: radial-gradient(
			circle at 100% 100%,
			transparent 72%,
			var(--theme-light-background) 72%
		);
		top: 0;
	}

	#kyuudex-sidebar::after {
		background: radial-gradient(
			circle at 100% 0%,
			transparent 72%,
			var(--theme-light-background) 72%
		);
		bottom: 0;
	}

	#kyuudex-footer {
		grid-area: footer;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5em;
		width: 200%;
		padding-inline-end: 1em;
		border-top-right-radius: 1.5rem;
		background: var(--theme-light-background);
		z-index: 2;
	}

	@media screen {
		#kyuudex-header > .header-footer > .navigation > .invisible {
			display: none;
		}
	}

	@media (min-width: 320px) and (max-width: 1024px) {
		#kyuudex {
			grid-template-areas:
				'header footer'
				'main main'
				'main main';
			grid-template-columns: 4fr auto;
			justify-content: center;
		}

		#kyuudex-header {
			grid-template-areas: 'logo search footer';
			grid-template-columns: 0.5fr 4fr auto;
			border-bottom-right-radius: 0;
			padding: 0.5rem 0;
		}

		#kyuudex-header > .header-logo > a,
		#kyuudex-header > .header-footer {
			display: none;
		}

		#kyuudex-header > .header-search {
			position: inherit;
		}

		#kyuudex-header > .header-logo > img {
			inline-size: 50%;
		}

		#kyuudex-sidebar {
			display: none;
		}

		#kyuudex-main {
			padding: 0.5rem;
		}

		#kyuudex-footer {
			width: 100%;
			border-radius: 0;
			padding-inline-end: 0;
		}
	}

	@media (min-width: 1024px) and (max-width: 1440px) {
		#kyuudex-header {
			grid-template-columns: 1.5fr 4fr auto;
		}

		#kyuudex-header > .header-footer > .navigation {
			gap: 2rem;
			letter-spacing: 2px;
			text-transform: uppercase;
		}
	}
</style>
