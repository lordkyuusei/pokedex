<svelte:options immutable />

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { LayoutData } from './$types';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import pokemon from '$lib/store/pokemon';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	import routes from './routes.json';
	import { navigatePokemon } from '$lib/functions/navigate';

	export let data: LayoutData;

	$: pokemon.set(data?.specie);
	$: varieties =
		data?.specie?.varieties.map((x) => {
			const id = Number(x.pokemon.url.split('/').at(-2));
			const [_, ...form] = x.pokemon.name.split('-');

			return { id, name: form.length ? form?.join(' ') : 'Default' };
		}) ?? [];

	const changeForm = (id: number) => {
		const url = navigatePokemon(id, $page);
		goto(url);
	};

	onDestroy(() => {
		pokemon.set(null);
	});
</script>

<section id="pokemon-data" class:default-form={varieties.length === 1} out:fade>
	{#if varieties.length !== 1}
		<header id="data-forms" in:fade>
			<menu id="forms-alternate">
				{#each varieties as variety (variety.id)}
					<li>
						<button
							type="button"
							id="data-form-{variety.name}"
							class:selected={$page.params.id === variety.id.toString()}
							on:click={() => changeForm(variety.id)}
						>
							<img src={fetchPokemonSpriteURL(variety.id, 'icons', 'generation-viii')} alt="?" />
							{variety.name}
						</button>
					</li>
				{/each}
			</menu>
		</header>
	{/if}
	<slot />
	<nav id="data-navigation">
		<menu>
			{#each routes as route}
				<li class:selected={$page.route.id?.endsWith(route.id)}>
					<a href={`/pokemon/${$page.params.id}${route.id}`}>
						{#if route.icon.includes('icon')}
							<svg>
								<use href="#{route.icon}" />
							</svg>
						{:else}
							<img src={`/${route.icon}`} alt={route.icon} />
						{/if}
					</a>
				</li>
			{/each}
		</menu>
	</nav>
	<hr />
	<span id="data-pokemon-id">
		#{data.pokemon.id}
	</span>
</section>

<style>
	:root {
		--layout-id-size: calc(var(--layout-header-size) - 2svh);
		--layout-pokemon-with-forms-size: calc(
			var(--layout-content-size) - var(--layout-header-size) - var(--layout-id-size)
		);
		--layout-pokemon-solo-size: calc(var(--layout-content-size) - var(--layout-id-size));
	}

	#pokemon-data {
		display: grid;
		align-items: center;
	}

	@media (min-width: 640px) {
		#pokemon-data:not(.default-form) {
			grid-template:
				'header header' var(--layout-header-size)
				'main navigation' var(--layout-pokemon-with-forms-size)
				'line id' var(--layout-id-size) / 90% 10%;
		}

		#pokemon-data.default-form {
			grid-template:
				'main navigation' var(--layout-pokemon-solo-size)
				'line id' var(--layout-id-size) / 90% 10%;
		}
	}

	:global(#data-stats) {
		grid-area: main;
	}

	#data-forms {
		grid-area: header;

		display: grid;
		width: calc(100% - 10svw);

		overflow-x: auto;
		align-items: center;
		padding: var(--small-gap) var(--normal-gap) 0;
	}

	#data-forms > #forms-alternate {
		display: grid;
		grid-auto-columns: minmax(10%, 1fr);
		grid-auto-flow: column;
		list-style: none;
		color: var(--background-color);
		background-color: var(--text-color);
		border-block: 4px solid var(--background-color);
		border-inline: 2px solid var(--background-color);
	}

	#data-forms > #forms-alternate li button[id^='data-form-'] {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
		padding-inline-end: 1.25em;
		font-size: 1.25rem;
		letter-spacing: 2px;
		text-transform: capitalize;
		border: none;
	}

	#data-forms > #forms-alternate li:not(:first-child) {
		border-inline: 2px solid var(--background-color);
	}

	#data-forms > #forms-alternate li [id^='data-form-'].selected {
		font-weight: bolder;
		color: var(--primary-color);
		background-color: var(--background-color);
	}

	#data-forms > #forms-alternate li [id^='data-form-'] img {
		inline-size: 3em;
		transform: translateY(-0.5em);
	}

	#data-navigation {
		grid-area: navigation;
	}

	#data-navigation menu {
		display: grid;
		place-items: end;
	}

	#data-navigation menu li {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 4em;
		width: 4em;
		list-style: none;
		background-color: var(--text-color);
		border-radius: var(--border-r-200);
		transition: transform var(--transition-duration) var(--transition);
	}

	#data-navigation menu li a {
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100%;
		padding: 0.25em;
	}

	#data-navigation menu li svg {
		height: 100%;
	}

	hr {
		grid-area: line;
		height: 0.5em;
		width: 100%;
		border: none;
		background-color: var(--primary-color);
	}

	#data-pokemon-id {
		grid-area: id;
		color: var(--primary-color);
		font-weight: bolder;
		text-align: center;
		font-size: 2em;
	}

	@media (max-width: 640px) {
		#data-forms,
		hr,
		#data-pokemon-id {
			display: none;
		}

		#pokemon-data {
			height: 100%;
			grid-template: 'navigation' 10% 'main' 90% / 100%;
		}

		#data-navigation {
			height: 100%;
		}

		#data-navigation > menu {
			color: var(--text-color);
			background-color: var(--background-accent);
			grid-template: 1fr / repeat(5, 1fr);
			place-items: center;
			height: 100%;
		}

		#data-navigation > menu > li {
			background-color: var(--background-accent);
			border-radius: 0;
			cursor: pointer;
		}

		#data-navigation > menu > li::before,
		#data-navigation > menu > li::after {
			content: none;
		}

		#data-navigation > menu > li.selected {
			width: 4rem;
		}
	}

	@media (min-width: 640px) {
		#data-navigation menu {
			grid-template: repeat(5, 1fr) / 100%;
			padding-block-end: 100%;
			gap: var(--normal-gap);
		}

		#data-navigation > menu > li:not(.selected) {
			margin-inline-end: 1rem;
		}

		#data-navigation > menu > li.selected {
			width: 8em;
			transition: all var(--transition-duration) var(--transition);
			border-radius: var(--border-r-50) 0 0 var(--border-r-50);
			position: relative;
		}

		#data-navigation menu li.selected svg {
			transform: translateX(-1.5em);
		}

		#data-navigation menu li.selected::before,
		#data-navigation menu li.selected::after {
			content: '';
			position: absolute;
			background-color: var(--background-alt-color);
			right: 0;
			height: 1em;
			width: 1em;
		}

		#data-navigation menu li.selected::before {
			bottom: 4em;
			background-image: radial-gradient(
				farthest-side at 0% 0%,
				var(--background-alt-color) 100%,
				var(--text-color)
			);
		}

		#data-navigation menu li.selected::after {
			top: 4em;
			background-image: radial-gradient(
				farthest-side at 0% 100%,
				var(--background-alt-color) 100%,
				var(--text-color)
			);
		}
	}
</style>
