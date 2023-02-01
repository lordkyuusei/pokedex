<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	import { t } from '$lib/store/i18n/i18n';
	import ThemeContext from '$lib/contextes/ThemeContext.svelte';
	import PokedexSearch from '$lib/components/shared/Search.svelte';
	import LangToggle from '$lib/components/shared/Lang.svelte';
	import PokedexThemeToggle from '$lib/components/shared/Theme.svelte';
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
				<a class="logo-ball" href="/">
					<img src="/favicon.png" alt="Beast ball logo" height="100%" width="100%" />
				</a>
				<a class="logo-text" href="/">KYUUDEX</a>
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
		--sidebar-w: 3.5em;

		display: grid;
		grid-template-areas:
			'header header'
			'sidebar main'
			'footer main';
		grid-template-rows: 1fr minmax(auto, 13fr) 1fr;
		grid-template-columns: minmax(var(--sidebar-w), 1fr) minmax(auto, 100%);
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

	#kyuudex-header > .header-logo > .logo-ball {
		display: flex;
		place-content: center;
	}

	#kyuudex-header > .header-logo > .logo-ball > img {
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
		z-index: 3;
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
		--padding-inline: 1em;

		grid-area: footer;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 0.5em;
		padding-inline: 1em;
		border-top-right-radius: 1.5rem;
		background: var(--theme-light-background);
		z-index: 2;
		width: calc(calc(var(--sidebar-w) * 3.5) + calc(var(--padding-inline) * 2.5));
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
		}

		#kyuudex-header > .header-logo > .logo-text,
		#kyuudex-header > .header-footer {
			display: none;
		}

		#kyuudex-header > .header-search {
			position: inherit;
		}

		#kyuudex-header > .header-logo > .logo-ball > img {
			inline-size: 50%;
		}

		#kyuudex-sidebar {
			display: none;
		}

		#kyuudex-main {
			padding: 1rem;
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
