<svelte:options immutable />

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { LayoutData } from './$types';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import pokemon from '$lib/store/pokemon';
	import { fetchPokemonSpriteURL } from '$lib/api/fetch';

	import routes from './routes.json';

	export let data: LayoutData;

	$: pokemon.set(data.specie);
	$: varieties = data.specie?.varieties.map((x) => {
		const id = Number(x.pokemon.url.split('/').at(-2));
		const [_, ...form] = x.pokemon.name.split('-');

		return { id, name: form.length ? form?.join(' ') : 'Default' };
	});

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
							on:click={() => goto($page.route.id.replace('[id]', variety.id))}
						>
							<img src={fetchPokemonSpriteURL(variety.id, 'icons', 'generation-viii')} alt="?" />
							{variety.name}
						</button>
					</li>
				{/each}
			</menu>
		</header>
	{/if}
	<div style="display: contents; grid-area: main">
		<slot />
	</div>
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

	#data-forms {
		grid-area: header;

		display: grid;
		grid-auto-columns: auto 1fr;
		grid-template-rows: 100%;
		grid-auto-flow: column;
		gap: var(--normal-gap);
		width: 90%;

		overflow-x: auto;
		align-items: center;
		padding: var(--small-gap) var(--normal-gap) 0;
	}

	#data-forms > #forms-alternate li [id^='data-form-'] {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 1.5rem;
		letter-spacing: 2px;
		text-transform: capitalize;
		color: var(--background-color);
		border-radius: var(--border-r-100);
		background-color: var(--text-color);
	}

	#data-forms > #forms-alternate {
		display: grid;
		grid-auto-columns: minmax(10%, 1fr);
		grid-auto-flow: column;
		height: 100%;
		margin-block: 0;
		padding-inline: 0;
		gap: var(--normal-gap);
		list-style: none;
	}

	#data-forms > #forms-alternate li [id^='data-form-'] {
		cursor: pointer;
		border: none;
		width: 100%;
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
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#data-navigation menu {
		display: grid;
		grid-template: repeat(5, 1fr) / 100%;
		place-content: center;
		place-items: center;
		gap: var(--normal-gap);

		padding-block-end: 100%;
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
		transition: transform 0.2s ease-out;
	}

	#data-navigation menu li.selected {
		transform: translateX(-1em);
		transition: transform 0.2s ease-out;
		border-radius: var(--border-r-200) 0 0 var(--border-r-200);
		position: relative;
		width: 140%;
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

	@media (max-width: 420px) {
		#pokemon-data:not(.default-form) {
			grid-template:
				'header' 1fr
				'main' auto;
		}

		#pokemon-data.default-form {
			grid-template: 'main' 100% / 100%;
		}
	}
</style>
