<script lang="ts">
	import GameSwitch from '../layout/GameSwitch.svelte';
	import LangSwitch from '../layout/LangSwitch.svelte';
	import PokemonDynamicHeader from '../layout/PokemonDynamicHeader.svelte';
	import Search from '../layout/Search.svelte';
	import ThemeSwitch from '../layout/ThemeSwitch.svelte';
	import _ from '$lib/store/i18n';

	type Route = {
		id: string;
		alt_id: string;
		name: string;
	};

	export let routes: Route[];
	export let routeId: string | null = '';
	export let isDev: boolean;
	export let generationsList: any[];
</script>

<section id="dex-layout">
	<sidebar id="dex-navigation">
		<header id="navigation-logo">
			<img src="/dex-logo.svg" alt="logo" />
		</header>
		<nav id="navigation-links">
			<menu class="links-texts">
				{#each routes as route (route.id)}
					<li class:selected={routeId?.startsWith(route.id) || routeId?.startsWith(route.alt_id)}>
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
			<GameSwitch {generationsList} />
			<Search />
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
		grid-template: 'sidebar main' 100svh / 1fr 5fr;
	}

	#dex-navigation {
		grid-area: sidebar;
		display: grid;
		grid-template:
			'sidebar-logo' 1fr
			'sidebar-links' 1fr
			'sidebar-settings' 1fr / auto;

		padding-block: 1em;
	}

	#dex-navigation > #navigation-logo,
	#dex-navigation > #navigation-settings {
		display: flex;
		place-content: center;
	}

	#dex-navigation > #navigation-logo {
		place-items: start;
	}

	#dex-navigation > #navigation-settings {
		place-items: end;
		gap: var(--normal-gap);
	}

	#dex-navigation > #navigation-logo > img {
		inline-size: 75%;
	}

	#dex-navigation > #navigation-links [class^='links'] {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		font-size: 1.75rem;
		gap: var(--small-gap);
		list-style-type: none;
		padding-inline-start: 0;
	}

	#dex-navigation > #navigation-links [class^='links'] > li {
		display: grid;
		align-items: center;
		padding: var(--small-gap);
	}

	#dex-navigation > #navigation-links [class^='links'] > li > a {
		display: block;
		width: 100%;
		text-align: end;
		text-transform: uppercase;
		letter-spacing: 0.2em;
	}

	#dex-navigation > #navigation-links [class^='links'] > .selected {
		position: relative;
		font-weight: bold;
		color: var(--primary-color);
		background-color: var(--background-alt-color);
		border-radius: var(--border-r-50) 0 0 var(--border-r-50);
		transition: display 0.3s ease-in-out;
	}

	#dex-navigation > #navigation-links [class^='links'] > .selected::before,
	#dex-navigation > #navigation-links [class^='links'] > .selected::after {
		position: absolute;
		content: '';
		right: 0;
		height: 1em;
		width: 1em;
		background-color: var(--background-alt-color);
	}

	#dex-navigation > #navigation-links [class^='links'] > .selected::before {
		bottom: 100%;
		background-image: radial-gradient(
			farthest-side at 0% 0%,
			var(--background-color) 100%,
			var(--background-alt-color)
		);
	}

	#dex-navigation > #navigation-links [class^='links'] > .selected::after {
		top: 100%;
		background-image: radial-gradient(
			farthest-side at 0% 100%,
			var(--background-color) 100%,
			var(--background-alt-color)
		);
	}

	#dex-main {
		display: grid;
		grid-template:
			'header' var(--layout-header-size)
			'content' var(--layout-content-size) / 100%;
		grid-area: main;
	}

	#dex-main > #main-header {
		height: 100%;
		display: flex;
		gap: var(--normal-gap);
		justify-content: space-between;
		align-items: center;
		padding-inline-end: 1em;
		border-bottom-right-radius: 1em;
	}

	#dex-main > #main-content {
		border-radius: var(--border-r-100) 0 0 0;
		background-color: var(--background-alt-color);
	}
</style>
