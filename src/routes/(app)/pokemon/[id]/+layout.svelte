<svelte:options immutable />

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { LayoutData } from './$types';

	import pokemon from '$lib/store/pokemon';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	import routes from './routes.json';
	import { device } from '$lib/store/device';
	import { generation } from '$lib/store/generation';
	import { navigatePokemon } from '$lib/functions/navigate';
	import Cover from '$lib/components/features/pokemon/Cover.svelte';
	import { computeOpenGraphDescription } from '$lib/functions/openGraph';
	import { fetchNewTypes, fetchOldTypes } from '$lib/functions/getPokemonTypes';

	export let data: LayoutData;

	$: pokemon.set(data?.specie);
	$: varieties =
		data?.specie?.varieties.map((x) => {
			const id = Number(x.pokemon.url.split('/').at(-2));
			const [_, ...form] = x.pokemon.name.split('-');

			return { id, name: form.length ? form?.join(' ') : 'Default' };
		}) ?? [];

	$: types = data.pokemon.past_types.length
		? fetchOldTypes(data.pokemon.past_types, data.pokemon.types, $generation?.id)
		: fetchNewTypes(data.pokemon.types);

	onDestroy(() => {
		pokemon.set(null);
	});
</script>

<svelte:head>
	<title>The Dex - Info about {data.pokemon?.name}"</title>
	<meta property="og:title" content="The Dex - Info about {data.pokemon?.name}" />
	<meta
		property="og:description"
		content={computeOpenGraphDescription({ pokemon: data.pokemon, specie: data.specie })}
	/>
	<meta
		property="og:image"
		content={fetchPokemonSpriteURL($page.params.id, 'icons', 'generation-viii')}
	/>
</svelte:head>

<section id="pokemon-data" class:default-form={varieties.length === 1} out:fade>
	{#if $device === 'mobile'}
		<Cover id={data.pokemon.id} sprite={data.pokemon.sprites.front_default} {types} />
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
		<slot />
	{:else}
		<!-- Header / Pokemon forms on desktop -->
		{#if varieties.length !== 1}
			<header id="data-forms" in:fade>
				<menu id="forms-alternate">
					{#each varieties as variety (variety.id)}
						<li>
							<button
								type="button"
								id="data-form-{variety.name}"
								class:selected={$page.params.id === variety.id.toString()}
								on:click={() => goto(navigatePokemon(variety.id, $page))}
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
	{/if}
</section>

<style>
	#pokemon-data {
		display: grid;

		& nav#data-navigation {
			grid-area: navigation;

			@media (min-width: 640px) {
				margin-block: auto;
			}

			& > menu {
				display: grid;
				place-items: end;

				& > li {
					display: flex;
					justify-content: center;
					align-items: center;
					height: 4em;
					width: 4em;
					list-style: none;
					border-radius: var(--border-r-200);
					background-color: var(--background-color-__);
					transition: transform var(--transition-duration) var(--transition);

					& > a {
						display: flex;
						justify-content: center;
						height: 100%;
						width: 100%;
						padding: 0.25em;

						& > svg {
							height: 100%;
						}
					}
				}
			}

			& > menu > li.selected {
				width: 4rem;
			}

			& > menu > li:not(.selected)::before,
			& > menu > li:not(.selected)::after {
				content: none;
			}
		}

		@media (max-width: 640px) {
			grid-template: 40% 10% 50% / 100%;
			overflow: hidden;

			& nav#data-navigation {
				grid-area: unset;
				& > menu {
					height: 100%;
					color: var(--text-color);
					background-color: var(--background-color-__);
					grid-template: 1fr / repeat(5, 1fr);
					place-items: center;

					& > li {
						background-color: var(--background-color-__);
						border-radius: 0;
						cursor: pointer;
					}
				}
			}
		}

		@media (min-width: 640px) {
			&:not(.default-form) {
				grid-template: 'header header' 8svh 'main navigation' 78svh 'line id' 6svh / 90% 10%;
			}

			&.default-form {
				grid-template: 'main navigation' 86svh 'line id' 6svh / 90% 10%;
			}

			& > hr {
				grid-area: line;
				height: 0.5em;
				width: 100%;
				border: none;
				background-color: var(--primary-color);
			}

			& > span#data-pokemon-id {
				grid-area: id;
				color: var(--primary-color);
				font-weight: bolder;
				text-align: center;
				font-size: 2em;
			}

			& > header#data-forms {
				grid-area: header;

				display: grid;
				overflow-x: auto;
				align-items: center;
				padding: var(--small-gap) var(--normal-gap) 0;

				& > menu#forms-alternate {
					display: grid;
					grid-auto-columns: minmax(10%, 10rem);
					grid-auto-flow: column;
					gap: var(--small-gap);
					list-style: none;

					& > li {
						& > button[id^='data-form-'] {
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

							&.selected {
								font-weight: bolder;
								color: var(--text-color);
								background-color: var(--background-color-_);
							}

							& > img {
								inline-size: 3em;
								transform: translateY(-0.5em);
							}
						}
					}
				}
			}

			& > nav#data-navigation menu {
				grid-template: repeat(5, 1fr) / 100%;
				padding-block-end: 100%;
				gap: var(--normal-gap);

				& > li:not(.selected) {
					margin-inline-end: 1rem;
				}

				& > li.selected {
					width: 8em;
					transition: all var(--transition-duration) var(--transition);
					border-radius: var(--border-r-50) 0 0 var(--border-r-50);
					position: relative;
					& > a > svg {
						transform: translateX(-1.5em);
					}

					&::before,
					&::after {
						content: '';
						position: absolute;
						background-color: var(--background-alt-color);
						right: 0;
						height: 1em;
						width: 1em;
					}

					&::before {
						bottom: 4em;
						background-image: radial-gradient(
							farthest-side at 0% 0%,
							var(--background-alt-color) 100%,
							var(--text-color)
						);
					}

					&::after {
						top: 4em;
						background-image: radial-gradient(
							farthest-side at 0% 100%,
							var(--background-alt-color) 100%,
							var(--text-color)
						);
					}
				}
			}
		}
	}
</style>
