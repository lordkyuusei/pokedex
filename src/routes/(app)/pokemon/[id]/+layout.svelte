<svelte:options immutable />

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	
	import routes from './routes.json';
	import pokemon from '$lib/store/pokemon';
	import { isMobile } from '$lib/store/device';
	import { generation } from '$lib/store/generation';
	import { navigatePokemon } from '$lib/functions/navigate';
	import { computeOpenGraphDescription } from '$lib/functions/openGraph';
	import { computePokemonTypes } from '$lib/functions/getPokemonTypes';
	
	import Cover from '$lib/components/features/pokemon/Cover.svelte';

	export let data: LayoutData;

	let varieties: { id: number, name: string }[] = [];
	let types: string[] = [];

	$: if (data && data.specie && data.pokemon) {
		pokemon.set(data.specie);

		types = computePokemonTypes(data.pokemon, $generation?.id);
		varieties = data.specie.varieties.map((variety) => {
			const { pokemon: pkmn } = variety;

			const id = Number(pkmn.url.split('/').at(-2));
			const [_, ...form] = pkmn.name.split('-');
		
			return { id, name: form.length ? form?.join(' ') : 'Default' };
		});
	}

	onDestroy(() => {
		pokemon.set(null);
	});
</script>

<svelte:head>
	<title>The Dex - Info about {data.pokemon?.name}"</title>
	<meta property="og:title" content="The Dex - Info about {data.pokemon?.name}" />
	<meta
		property="og:description"
		content={computeOpenGraphDescription(data.pokemon, data.specie)}
	/>
	<meta
		property="og:image"
		content={fetchPokemonSpriteURL($page.params.id, 'icons', 'generation-viii')}
	/>
</svelte:head>

<section id="pokemon-data" class:default-form={varieties.length === 1} out:fade>
	{#if $isMobile}
		<Cover id={data.pokemon?.id} sprite={data.pokemon?.sprites.front_default} {types} />
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
			<aside id="data-forms" in:fade>
				<menu>
					{#each varieties as variety (variety.id)}
						<li class:selected={$page.params.id === variety.id.toString()}>
							<a
								title={variety.name}
								id="data-form-{variety.name}"
								href={navigatePokemon(variety.id, $page)}
							>
								<img src={fetchPokemonSpriteURL(variety.id, 'icons', 'generation-viii')} alt="?" />
							</a>
						</li>
					{/each}
				</menu>
			</aside>
		{/if}
		<nav id="data-navigation" in:fade>
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
		<hr />
		<span id="data-pokemon-id">
			#{data.pokemon?.id}
		</span>
	{/if}
</section>

<style>
	#pokemon-data {
		--data-forms-width: var(--width-unit);
		--data-nav-width: var(--width-unit);

		display: grid;

		& nav#data-navigation {
			grid-area: navigation;

			& > menu {
				justify-items: end;
			}
		}

		& aside#data-forms {
			grid-area: forms;

			& > menu {
				justify-items: start;
			}
		}

		& nav#data-navigation,
		& aside#data-forms {
			height: 100%;
			overflow-y: auto;

			@media (min-width: 640px) {
				margin-block: 1rem;
			}

			& > menu {
				display: grid;
				grid-auto-rows: 1fr;
				grid-template-columns: 100%;
				gap: var(--normal-gap);
			}

			& > menu > li {
				display: flex;
				place-items: center;
				height: 4rem;
				width: 4rem;
				list-style: none;
				background-color: var(--background-color);
				transition: transform var(--transition-duration) var(--transition-function);

				& > a {
					display: flex;
					justify-content: center;
					height: 100%;
					width: 100%;
					padding: var(--smallest-gap);
					border-radius: var(--border-r-50);

					& > svg {
						height: 100%;
					}
				}

				&:not(.selected)::before,
				&:not(.selected)::after {
					content: none;
				}
			}
		}

		/* Mobile */
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

		/* Not mobile */
		@media (min-width: 640px) {
			&:not(.default-form) {
				grid-template:
					'forms main navigation' 85svh
					'line line id' 5svh / var(--data-forms-width) auto var(--data-nav-width);
			}

			&.default-form {
				grid-template:
					'main navigation' 85svh
					'line id' 5svh / auto var(--data-nav-width);
			}

			& > hr {
				grid-area: line;
				height: 0.5rem;
				width: 100%;
				border: none;
				border-radius: 0 var(--border-r-50) var(--border-r-50) 0;
				background-color: var(--second-color);
			}

			& > span#data-pokemon-id {
				grid-area: id;
				color: var(--second-color);
				font-weight: bolder;
				text-align: center;
				font-size: 1.5rem;
			}

			& > nav#data-navigation menu {
				& > li:not(.selected) {
					margin-inline-end: var(--small-gap);
				}

				& > li.selected {
					& > a {
						border-radius: var(--border-r-50) 0 0 var(--border-r-50);

						& > svg {
							transform: translateX(-1.5em);
						}
					}
				}
			}
			& > aside#data-forms menu {
				& > li:not(.selected) {
					margin-inline-start: 1rem;
				}

				& > li.selected {
					& > a {
						border-radius: 0 var(--border-r-50) var(--border-r-50) 0;

						& > svg {
							transform: translateX(-1.5rem);
						}
					}
				}
			}

			& > nav#data-navigation menu,
			& > aside#data-forms menu {
				& > li.selected {
					width: 100%;
					position: relative;
					background-color: var(--background-color);
					transition: all var(--transition-duration) var(--transition-function);

					& > a {
						background-color: var(--background-second-color);
					}
				}
			}
		}
	}
</style>
