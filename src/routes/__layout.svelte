<script lang="ts">
	import { page } from '$app/stores';
	import PokedexSearch from '$lib/components/PokedexSearch.svelte';

	import PokedexThemeToggle from '$lib/components/PokemonLayouts/PokedexThemeToggle.svelte';
	import ThemeContext from '$lib/contextes/ThemeContext.svelte';

	let isVisible: boolean = false;
	const navigation: any[] = [
		{
			name: 'Home',
			path: '/',
			icon: 'home'
		},
		{
			name: 'Pokedex',
			path: '/pokedex',
			icon: 'codex'
		},
		{
			name: 'About',
			path: '/about',
			icon: 'info'
		}
	];
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ThemeContext>
	<header class="kyuudex-layout">
		<div class="kyuudex-theming">
			<PokedexThemeToggle />
		</div>
		<div class="kyuudex-search">
			<PokedexSearch />
		</div>
		<button class="kyuudex-navigation-toggle" on:click={() => (isVisible = !isVisible)}>🍔</button>
		<nav class="kyuudex-navigation" class:isVisible>
			<ul class="navigation-links">
				{#each navigation as navigation_link}
					<li class:isActive={$page.url.pathname === navigation_link.path}>
						<a href={navigation_link.path} on:click={() => (isVisible = false)}>
							{navigation_link.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>
	<main class:isVisible>
		<slot />
	</main>
	<footer />
</ThemeContext>

<style>
	.kyuudex-layout {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.kyuudex-theming,
	.kyuudex-navigation,
	.kyuudex-search {
		width: 100%;
	}

	.kyuudex-navigation {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.navigation-links {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		flex: 3;
	}

	.navigation-links li {
		list-style: none;
		letter-spacing: 8px;
		text-indent: 8px;
		text-transform: uppercase;
	}

	li {
		border-bottom: 2px solid var(--theme-background);
	}

	li::after {
		display: block;
		content: '';
		border-bottom: 2px solid var(--theme-text);
		transform: scaleX(0);
		transition: transform 0.2s ease-in-out;
	}

	li:hover:after {
		transform: scaleX(1);
	}

	li.isActive {
		border-bottom: 2px solid var(--theme-text);
	}

	li a {
		color: var(--text-color);
		text-decoration: none;
		font-size: 1rem;
		font-weight: bold;
	}

	.kyuudex-navigation-toggle {
		display: none;
	}

	@media screen and (max-width: 800px) {
		.kyuudex-layout {
			display: grid;
			grid-template-columns: 10% 65% 10%;
			margin-bottom: 1rem;
		}

		.kyuudex-navigation-toggle {
			display: block;
			background-color: var(--theme-alt-background);
			border: none;
		}

		.kyuudex-navigation {
			display: none;
		}

		.kyuudex-navigation.isVisible {
			position: absolute;
			display: block;
			top: 2.5rem;
			width: calc(100% - 1rem);
			background-color: var(--theme-alt-background);
			z-index: 1;
		}

		.navigation-links {
			flex-direction: column;
			width: calc(100% - 3rem);
			align-items: flex-end;
		}

		.navigation-links li {
			margin-left: 0;
			margin-top: 1rem;
		}

		main.isVisible {
			opacity: 0.3;
		}
	}
</style>
