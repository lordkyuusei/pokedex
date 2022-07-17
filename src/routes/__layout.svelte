<script lang="ts">
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/env';

	import { page } from '$app/stores';
	import { t } from '$lib/store/i18n/i18n';
	import ThemeContext from '$lib/contextes/ThemeContext.svelte';
	import PokedexSearch from '$lib/components/PokedexSearch.svelte';
	import Button from '$lib/components/PokemonLayouts/Button.svelte';
	import LangToggle from '$lib/components/PokemonLayouts/LangToggle.svelte';
	import PokedexThemeToggle from '$lib/components/PokemonLayouts/PokedexThemeToggle.svelte';

	let isVisible: boolean = false;
	$: icon = isVisible ? '🍘' : '🍙';
	$: title = $t('layout.storage');

	const navigation: any[] = [
		{
			name: 'menu.home',
			path: '/',
			icon: 'home'
		},
		{
			name: 'menu.pokedex',
			path: '/pokedex',
			icon: 'codex'
		},
		{
			name: 'menu.about',
			path: '/about',
			icon: 'info'
		}
	];

	onMount(() => {
		if (dev) {
			navigation.push({
				name: 'menu.experiments',
				path: '/experiments',
				icon: 'bug'
			});
		}
	});
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
		<button class="kyuudex-navigation-toggle" on:click={() => (isVisible = !isVisible)}
			>{icon}</button
		>
		<nav class="kyuudex-navigation" class:isVisible>
			<ul class="navigation-links">
				{#each navigation as navigation_link}
					<li class:isActive={$page.url.pathname === navigation_link.path}>
						<a href={navigation_link.path} on:click={() => (isVisible = false)}>
							{$t(navigation_link.name)}
						</a>
					</li>
				{/each}
			</ul>
			<LangToggle />
			<Button diamond {title} on:click={() => (browser ? localStorage.clear() : () => true)}
				>Clear Storage</Button
			>
		</nav>
	</header>
	<main class:isVisible>
		<slot />
	</main>
	<footer />
</ThemeContext>

<style>
	main {
		padding: 0.5rem;
	}

	.kyuudex-layout {
		height: 3rem;
		display: grid;
		align-items: center;
		grid-template-rows: 100%;
		grid-template-columns: 10% 33% auto;
		background: var(--theme-alt-background);
	}

	.kyuudex-theming,
	.kyuudex-search,
	.kyuudex-navigation {
		width: calc(100% - 1rem);
	}

	.kyuudex-theming {
		display: flex;
		justify-content: center;
	}

	.kyuudex-navigation {
		display: flex;
		flex-direction: row;
		align-items: center;
		align-content: flex-end;
	}

	.kyuudex-search {
		position: relative;
	}

	.navigation-links {
		flex: 3;
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}

	.navigation-links li {
		list-style: none;
		margin: 0.5rem;
	}

	.navigation-links li {
		list-style: none;
		letter-spacing: 6px;
		text-indent: 6px;
		text-transform: uppercase;
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

	@media screen and (max-width: 1024px) {
		.kyuudex-layout {
			grid-template-columns: 15% 70% 15%;
			justify-items: flex-end;
			position: relative;
		}

		.kyuudex-navigation-toggle {
			height: 100%;
			border-top: 0;
			display: block;
			border-right: 0;
			font-size: 1.5rem;
			border-style: solid;
			width: 3rem;
			color: var(--theme-text);
			border-color: var(--theme-text);
			background-color: var(--theme-alt-background);
		}

		.kyuudex-navigation {
			display: none;
		}

		.kyuudex-navigation.isVisible {
			top: 3rem;
			z-index: 1;
			width: 100%;
			opacity: 0.9;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			position: absolute;
			border: 1px solid var(--theme-text);
			background-color: var(--theme-alt-background);
		}

		.navigation-links {
			flex-direction: column;
			width: calc(100% - 4rem);
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
