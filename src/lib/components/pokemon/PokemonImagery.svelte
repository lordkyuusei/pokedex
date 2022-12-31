<script lang="ts">
	import Card from '$lib/components/barebone/Card.svelte';
	import type { OtherSpritesRef, SpritesRef, VersionsSpritesRef } from '$lib/types/Pokemon';
	import type { PokemonImagery } from '$lib/types/PokemonImagery';
	import { t } from '$lib/store/i18n/i18n';

	export let sprites: SpritesRef = null;

	const mapRomanToGen = {
		'generation-i': 1,
		'generation-ii': 2,
		'generation-iii': 3,
		'generation-iv': 4,
		'generation-v': 5,
		'generation-vi': 6,
		'generation-vii': 7,
		'generation-viii': 8
	};

	const pokemonImageryTypes = ['default', 'games', 'other'];

	let imageryType: string = pokemonImageryTypes[0];

	$: spritesList = mapSpritesToList(sprites);
	$: spritesChosen = getSpritesFromList(spritesList, imageryType);

	const mapSpritesToDefault = (sprite: string) => ({
		name: 'default',
		url: sprite,
		game: 'default',
		generation: 0,
		isFemale: false,
		isShiny: false,
		isFront: sprite?.includes('front') || false
	});

	const mapSpritesToOther = (sprites: OtherSpritesRef) => {
		if (!sprites) return [];

		let imagery: PokemonImagery[] = [];
		Object.entries(sprites).map(([app, images]) => {
			Object.entries(images).map(([name, url]) => {
				imagery = [
					...imagery,
					{
						name,
						url,
						game: app,
						generation: 0,
						isFemale: false,
						isFront: false,
						isShiny: false
					}
				];
			});
		});

		return imagery;
	};

	const mapSpritesToVersions = (sprites: VersionsSpritesRef): PokemonImagery[] => {
		if (!sprites) return [];

		let imagery: PokemonImagery[] = [];
		Object.entries(sprites).map(([generation, games]) => {
			Object.entries(games).map(([game, images]) => {
				Object.entries(images).map(([name, url]) => {
					if (name === 'animated') {
						Object.entries(url).map(([name, url]) => {
							imagery = [
								...imagery,
								{
									name,
									url,
									game,
									generation: mapRomanToGen[generation],
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
								generation: mapRomanToGen[generation],
								isFemale: name.includes('female'),
								isShiny: name.includes('shiny'),
								isFront: name.includes('front')
							}
						];
					}
				});
			});
		});

		return imagery;
	};

	const mapSpritesToList = (sprites: SpritesRef): PokemonImagery[] => {
		if (!sprites) return [];

		const mapSpriteTypeToMethod = [
			{
				cond: (type: string) => type === 'versions',
				func: (sprites: VersionsSpritesRef) => mapSpritesToVersions(sprites)
			},
			{
				cond: (type: string) => type === 'other',
				func: (sprites: OtherSpritesRef) => mapSpritesToOther(sprites)
			},
			{
				cond: (_: any) => true,
				func: (sprite: string) => mapSpritesToDefault(sprite)
			}
		];

		const spritesListRaw = Object.entries(sprites).flatMap(([key, value]) => {
			const method: any = mapSpriteTypeToMethod.find(({ cond }) => cond(key)).func;
			return method(value);
		});

		return spritesListRaw.filter(({ url }) => ![null, undefined].includes(url));
	};

	const getSpritesFromList = (sprites: PokemonImagery[], type: string) => {
		const mapSpritesToType = [
			{ cond: type === 'default', sprites: sprites.filter(({ name }) => name === type) },
			{ cond: type === 'games', sprites: sprites.filter(({ generation }) => generation !== 0) },
			{
				cond: type === 'other',
				sprites: sprites.filter(({ name, generation }) => name !== 'default' && generation === 0)
			}
		];

		return mapSpritesToType.find(({ cond }) => cond).sprites;
	};
</script>

<Card title="Imagerie">
	<section class="pokemon-imagery-type">
		{#each pokemonImageryTypes as type}
			<button
				class="imagery-type-button"
				title={$t(`imagery.type-${type}`)}
				class:chosen={imageryType === type}
				on:click={() => (imageryType = type)}>{$t(`imagery.type-${type}`)}</button
			>
		{/each}
	</section>

	<section class="pokemon-pictures">
		{#each spritesChosen as sprite}
			<figure class="picture">
				<img class:pixelated={imageryType === 'games'} src={sprite.url} alt={sprite.name} />
				<figcaption>
					{$t(`sprite.${sprite.name}`)}, {sprite.game}
				</figcaption>
			</figure>
		{/each}
	</section>
</Card>

<style>
	.pokemon-imagery-type {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		width: 100%;
		overflow-x: auto;
		border-radius: var(--theme-border-r) var(--theme-border-r) 0 0;
	}

	.imagery-type-button {
		font: inherit;
		border-width: 0 0 1px 0;
		background-color: var(--theme-background);
		color: var(--theme-text);
		cursor: pointer;
		width: 100%;
		transition: 0.2s;
		white-space: nowrap;
		text-transform: capitalize;
		border-color: var(--theme-text);
	}

	.imagery-type-button:hover {
		color: var(--theme-background);
		background-color: var(--theme-text);
	}

	.chosen {
		color: white;
		background-color: var(--theme-secondary);
	}

	.pokemon-pictures {
		display: flex;
		width: 100%;
		height: 100%;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
	}

	.pokemon-pictures > .picture {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1em;
		scroll-snap-align: start;
		scroll-margin-inline-start: 1em;
	}

	.pokemon-pictures > .picture > img {
		height: 125px;
		aspect-ratio: 1 / 1;
		border: 1px solid var(--theme-text);
		border-radius: var(--theme-border-r);
	}

	.pokemon-pictures > .picture > .pixelated {
		image-rendering: pixelated;
	}
</style>
