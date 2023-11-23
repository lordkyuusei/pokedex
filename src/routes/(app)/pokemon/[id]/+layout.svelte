<svelte:options immutable />

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { LayoutData } from './$types';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import pokemon from '$lib/store/pokemon';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	import routes from './routes.json';
	import { navigatePokemon } from '$lib/functions/navigate';
	import { device } from '$lib/store/device';
	import Cover from '$lib/components/features/pokemon/Cover.svelte';
	import { fetchNewTypes, fetchOldTypes } from '$lib/functions/getPokemonTypes';
	import { generation } from '$lib/store/generation';
	import { browser } from '$app/environment';
	import { tweened, type Tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	export let data: LayoutData;

	let isGrabbing: boolean = false;

	const botTreshold: Tweened<number> = tweened(40, {
		duration: 50,
		easing: cubicInOut
	});
	const topTreshold: Tweened<number> = tweened(50, {
		duration: 50,
		easing: cubicInOut
	});

	let gridRef: HTMLElement | null;

	const grabHandle = (event: MouseEvent | TouchEvent) => {
		isGrabbing = true;

		if (browser) {
			gridRef = document.querySelector('#pokemon-data');
		}

		if (event instanceof TouchEvent && event.cancelable) {
			event.preventDefault();
		}
	};

	const resizeGrid = (event: MouseEvent | TouchEvent) => {
		if (isGrabbing && browser) {
			if (!gridRef) return;
			const { clientY } = event instanceof MouseEvent ? event : event.touches[0];
			const { top, height } = gridRef.getBoundingClientRect();
			$topTreshold = ((clientY - top) / height) * 100;
			$botTreshold = 100 - $topTreshold;
		}
	};

	const releaseHandle = (_: MouseEvent | TouchEvent) => {
		if (browser && isGrabbing && gridRef) {
			isGrabbing = false;
			if ($topTreshold <= 25) {
				$topTreshold = 25;
				$botTreshold = 65;
			} else if ($topTreshold > 25 && $topTreshold < 65) {
				$topTreshold = 40;
				$botTreshold = 50;
			} else if ($topTreshold >= 65) {
				$topTreshold = 65;
				$botTreshold = 25;
			}
		}
	};

	let mapEventToListener = [
		{ e: 'mousemove', l: resizeGrid },
		{ e: 'touchmove', l: resizeGrid },
		{ e: 'mouseup', l: releaseHandle },
		{ e: 'touchend', l: releaseHandle }
	];

	const getGridTemplateInline = (
		isMobile: boolean,
		showForms: boolean,
		top: number,
		bottom: number
	) =>
		isMobile
			? `'navigation' 10% 'cover' ${top}% 'content' ${bottom}% / 100%`
			: showForms
			? "'header header' 8svh 'main navigation' 78svh 'line id' 6svh / 90% 10%"
			: "'main navigation' 86svh 'line id' 6svh / 90% 10%";

	$: gridTemplate = getGridTemplateInline(
		$device === 'mobile',
		varieties.length !== 1,
		$topTreshold,
		$botTreshold
	);

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

	onMount(() => {
		mapEventToListener.forEach((etl) =>
			document.addEventListener(etl.e, etl.l, {
				passive: true
			})
		);
	});

	onDestroy(() => {
		pokemon.set(null);
		if (browser) {
			mapEventToListener.forEach((etl) => document.removeEventListener(etl.e, etl.l));
		}
	});
</script>

<svelte:head>
	<meta property="og:title" content="The Dex - Info about {data.pokemon?.name}" />
	<meta property="og:description" content="Info about {data.pokemon?.name}" />
	<meta
		property="og:image"
		content={fetchPokemonSpriteURL($page.params.id, 'icons', 'generation-viii')}
	/>
</svelte:head>
<section
	id="pokemon-data"
	class:default-form={varieties.length === 1}
	out:fade
	style:grid-template={gridTemplate}
>
	<!-- Header / Pokemon forms on desktop -->
	{#if $device !== 'mobile' && varieties.length !== 1}
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

	<!-- Desktop-only content // then mobile-only -->
	{#if $device !== 'mobile'}
		<slot />
		<hr />
		<span id="data-pokemon-id">
			#{data.pokemon.id}
		</span>
	{:else}
		<Cover id={data.pokemon.id} sprite={data.pokemon.sprites.front_default} {types} />
		<div id="stats-group">
			<button class="group-separator" on:mousedown={grabHandle} on:touchstart={grabHandle} />
			<slot />
		</div>
	{/if}
</section>

<style>
	#pokemon-data {
		display: grid;
		align-items: center;

		& > nav#data-navigation {
			grid-area: navigation;

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
			height: 100%;
			/* grid-template: 'navigation' 8% 'cover' 40% 'content' 50% / 100%; */

			& > #stats-group {
				display: grid;
				grid-template: 5% 95% / 100%;
				justify-content: center;
				align-items: center;

				height: 100%;
				padding-block: 0.5rem;
				border: 1px solid transparent;
				border-radius: var(--border-r-100);
				background-color: var(--background-color-___);

				& > .group-separator {
					width: 50%;
					height: 5px;
					background-color: var(--background-color-____);
					border: 1px solid transparent;
					border-radius: var(--border-r-100);
					margin-inline: auto;
				}
			}
			& > nav#data-navigation {
				height: 100%;

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
				/* grid-template:
					'header header' var(--layout-header-size)
					'main navigation' var(--layout-pokemon-with-forms-size)
					'line id' var(--layout-id-size) / 90% 10% !important; */
			}

			&.default-form {
				/* grid-template:
					'main navigation' var(--layout-pokemon-solo-size)
					'line id' var(--layout-id-size) / 90% 10% !important; */
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
