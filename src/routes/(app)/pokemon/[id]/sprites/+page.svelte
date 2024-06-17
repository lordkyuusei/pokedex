<svelte:options immutable />

<script lang="ts">
	import type { PageData } from './$types';

	import type { Generation } from '$lib/types/generation';
	import type { PokemonImagery } from '$lib/types/imagery';
	import { generation, version } from '$lib/store/generation';
	import type { Pokemon, SpritesRef } from '$lib/types/pokeapi/pokemon';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import Switch from '$lib/components/common/Switch.svelte';

	type SpriteTab = 'forms' | 'version' | 'others';

	export let data: PageData;

	let shiny: boolean = false;
	let tabs: SpriteTab[] = [];
	let selectedTab: SpriteTab | null;
	let forms: PokemonImagery[] = [];
	let versionSpritesRaw: PokemonImagery[];
	let otherSpritesRaw: PokemonImagery[];
	let sprites: PokemonImagery[] = [];

	$: if (data.pokemon) {
		loadPokemonSprites(data.pokemon);
		otherSpritesRaw = loadOtherSprites(data.pokemon);
	}

	$: if (data.pokemon && $generation && $version) {
		versionSpritesRaw = loadVersionSprites(data.pokemon, $generation, $version);
	}

	$: versionSprites = versionSpritesRaw.filter((v) => v.isShiny === shiny);
	$: otherSprites = otherSpritesRaw.filter((v) => v.isShiny === shiny);

	$: if (selectedTab && $version) {
		sprites = getSelectedSprites(selectedTab);
	}

	const loadPokemonSprites = (pokemon: Pokemon) => {
		const { id } = pokemon;

		forms = pokemon.forms.map((x) => {
			const [, ...form] = x.name.split('-');
			return {
				name: x.name,
				game: $version,
				generation: $generation.id,
				isFemale: false,
				isFront: false,
				isShiny: false,
				url: fetchPokemonSpriteURL(`${id}-${form.join('-')}`)
			};
		});

		tabs = forms.length > 1 ? ['forms', 'version', 'others'] : ['version', 'others'];
		selectedTab = tabs[0];
	};

	const loadVersionSprites = (pokemon: Pokemon, generation: Generation, version: string) => {
		const { sprites } = pokemon;
		if (!sprites) return [];

		try {
			let imagery: PokemonImagery[] = [];

			Object.entries(sprites.versions[generation.name]).map(([game, images]) => {
				Object.entries(images).map(([name, url]) => {
					if (name === 'animated') {
						Object.entries(url).map(([name, url]) => {
							imagery = [
								...imagery,
								{
									name,
									url,
									game,
									generation: generation.id,
									isFemale: name.includes('female'),
									isShiny: name.includes('shiny'),
									isFront: name.includes('front')
								}
							];
						});
					} else {
						imagery = [
							...imagery,
							{
								name,
								url,
								game,
								generation: generation.id,
								isFemale: name.includes('female'),
								isShiny: name.includes('shiny'),
								isFront: name.includes('front')
							}
						];
					}
				});
			});
			return imagery.filter((i) => i.url);
		} catch (err) {
			return [
				{
					name: '[No picture available for ' + generation.name + ' ' + version + ']',
					url: fetchPokemonSpriteURL(0),
					game: '',
					generation: 0,
					isFemale: false,
					isShiny: false,
					isFront: false
				}
			];
		}
	};

	const loadOtherSprites = (pokemon: Pokemon) => {
		const { sprites } = pokemon;
		if (!sprites) return [];

		let imagery: PokemonImagery[] = [];

		Object.entries(sprites.other).map(([app, images]) => {
			Object.entries(images).map(([name, url]) => {
				imagery = [
					...imagery,
					{
						name,
						url,
						game: app,
						generation: 0,
						isFemale: name.includes('female'),
						isShiny: name.includes('shiny'),
						isFront: name.includes('front')
					}
				];
			});
		});

		return imagery.filter((i) => i.url);
	};

	const toggleShiny = (e: any) => (shiny = e.detail.shiny);

	const getSelectedSprites = (tab: SpriteTab) =>
		[
			{ c: tab === 'forms', sprites: forms },
			{ c: tab === 'version', sprites: versionSprites },
			{ c: tab === 'others', sprites: otherSprites }
		].find((collection) => collection.c === true)?.sprites || [];
</script>

<section id="data-sprites">
	<div id="sprites">
		<header id="sprites-options">
			<div>
				{#each tabs as tab}
					<button
						id="tab-{tab}"
						class:selected={selectedTab === tab}
						on:click={() => (selectedTab = tab)}>{tab}</button
					>
				{/each}
			</div>
			<Switch event="shiny" icon="shiny" on:shiny={toggleShiny} />
		</header>
		<div id="sprites-pictures">
			{#each sprites as sprite}
				<figure class="picture">
					<img src={sprite.url} alt="{sprite.name} - {sprite.game}" />
					<figcaption>
						{sprite.name}
					</figcaption>
				</figure>
			{/each}
		</div>
	</div>
</section>

<style>
	section#data-sprites {
		--sprite-size: clamp(150px, 180px, 200px);

		padding: var(--small-gap);
		display: grid;
		grid-template: 100% / 100%;

		& > div#sprites {
			position: relative;
			overflow-y: auto;
			display: grid;
			grid-template: 'sprites-options' auto 'sprites-pictures' 1fr / 100%;

			box-shadow: var(--box-shadow);
			border-radius: var(--border-r-50);
			background-color: var(--background-second-color);

			& > header#sprites-options {
				position: sticky;
				top: 0;
				display: grid;
				grid-template: 100% / auto 1fr;
				align-items: center;
				justify-items: end;

				padding-inline-end: var(--small-gap);
				background-color: var(--background-second-color);
				border-bottom: 1px solid var(--text-color);

				& button:first-child {
					border-top-left-radius: var(--border-r-50);
				}

				& button {
					height: 100%;
					padding: var(--small-gap) var(--normal-gap);

					&.selected {
						background-color: var(--text-color);
						color: var(--background-color);
					}
				}
			}

			& > #sprites-pictures {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(calc(var(--sprite-size) * 1.25), 1fr));
				place-items: center;
				gap: var(--small-gap);
				padding: var(--small-gap);
				overflow-y: auto;

				& figure.picture {
					display: grid;
					grid-template: 1fr 1.5rem / 100%;
					place-items: center;
					gap: var(--smallest-gap);

					height: 100%;
					aspect-ratio: 1 / 1;
					padding: var(--smallest-gap);
					border-radius: var(--border-r-100);
					background-color: var(--background-color);

					& > img {
						height: var(--sprite-size);
						aspect-ratio: 1 / 1;
						image-rendering: pixelated;
					}
				}
			}
		}
	}

	@media (max-width: 640px) {
		#data-sprites {
			padding: 0;
		}

		#data-sprites > #sprites {
			border-radius: 0;
		}
	}
</style>
