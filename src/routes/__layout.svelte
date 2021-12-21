<script lang="ts">
	import { goto } from '$app/navigation';
	import PokedexThemeToggle from '$lib/components/PokedexThemeToggle.svelte';
	import ThemeContext from '$lib/contextes/ThemeContext.svelte';
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ThemeContext>
	<header class="kyuudex-layout">
		<div class="kyuudex-theming">
			<PokedexThemeToggle />
		</div>
		<nav class="kyuudex-navigation">
			<ul class="navigation-links">
				<li><a href="/">Home</a></li>
				<li><a href="/pokedex">Pokedex</a></li>
				<li><a href="/about">About</a></li>
			</ul>
		</nav>
	</header>
	<main>
		<slot />
	</main>
	<footer />
</ThemeContext>

<style scoped>
	.kyuudex-layout {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.kyuudex-navigation {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.navigation-links {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.navigation-links li {
		list-style: none;
		margin-left: 2rem;
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

	li a {
		color: var(--text-color);
		text-decoration: none;
		font-size: 1rem;
		font-weight: bold;
	}
</style>
