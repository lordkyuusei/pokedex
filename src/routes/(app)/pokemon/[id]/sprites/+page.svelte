<svelte:options immutable />

<script lang="ts">
	import Switch from '$lib/components/common/Switch.svelte';
	import { generation, version } from '$lib/store/generation';
	import type { Generation } from '$lib/types/generation';
	import type { PokemonImagery } from '$lib/types/imagery';
	import type { SpritesRef } from '$lib/types/pokeapi/pokemon';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import type { PageData } from './$types';

	export let data: PageData;

	let shiny: boolean = false;

	$: forms = data.pokemon.forms.map((x) => {
		const [, ...form] = x.name.split('-');
		return {
			id: `${data.pokemon.id}-${form.join('-')}`,
			name: x.name
		};
	});

	$: versionSpritesRaw = mapVersionToSprites(data.pokemon.sprites, $generation, $version);
	$: otherSpritesRaw = mapOthersToSprites(data.pokemon.sprites);

	$: versionSprites = versionSpritesRaw.filter((v) => v.isShiny === shiny);
	$: otherSprites = otherSpritesRaw.filter((v) => v.isShiny === shiny);

	const toggleShiny = (e: any) => (shiny = e.detail.shiny);

	const mapVersionToSprites = (sprites: SpritesRef, generation: Generation, version: string) => {
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

	const mapOthersToSprites = (sprites: SpritesRef) => {
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
</script>

<section id="data-sprites">
	<section id="sprites">
		<header id="sprites-options">
			<Switch event="shiny" icon="shiny" on:shiny={toggleShiny} />
		</header>
		<section id="sprites-pictures">
			{#if forms.length > 1}
				<section id="pictures-forms">
					{#each forms as form}
						<figure class="picture">
							<img src={fetchPokemonSpriteURL(form.id)} alt={form.id} />
							<figcaption>
								{form.name}
							</figcaption>
						</figure>
					{/each}
				</section>
			{/if}
			<section id="pictures-gallery-version">
				{#each versionSprites as sprite}
					<figure class="picture">
						<img src={sprite.url} alt={sprite.name} />
						<figcaption>
							{sprite.name}
						</figcaption>
					</figure>
				{/each}
			</section>
			<section id="pictures-gallery-other">
				{#each otherSprites as sprite}
					<figure class="picture">
						<img src={sprite.url} alt={sprite.name} />
						<figcaption>
							{sprite.game}
						</figcaption>
					</figure>
				{/each}
			</section>
		</section>
	</section>
</section>

<style>
	#data-sprites {
		padding: 2em;
		height: 100%;
	}

	#data-sprites > #sprites {
		display: grid;
		grid-template: 'sprites-options' 1fr 'sprites-pictures' 9fr / 100%;

		height: 100%;
		width: 100%;
		border-radius: var(--border-r-200);
		background-color: var(--background-color);
		box-shadow: 0 0 10px 5px var(--background-secondary);
	}

	#data-sprites > #sprites > #sprites-options {
		display: flex;
		justify-content: flex-end;
		align-items: center;

		padding-inline: 1em;
		padding-block: 1em;
		border-bottom: 1px solid var(--background-accent);
	}

	#data-sprites > #sprites > #sprites-pictures {
		display: grid;
		grid-auto-rows: 1fr;
	}

	#data-sprites > #sprites > #sprites-pictures [id^='pictures'] {
		display: flex;
		align-items: center;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
	}

	#data-sprites > #sprites > #sprites-pictures [id^='pictures'] .picture {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1em;
		scroll-snap-align: start;
		scroll-margin-inline-start: 1em;
	}

	#data-sprites > #sprites > #sprites-pictures [id^='pictures'] .picture > img {
		height: 125px;
		aspect-ratio: 1 / 1;
		border: 1px solid var(--text-color);
		border-radius: var(--border-r-100);
	}

	#data-sprites > #sprites > #sprites-pictures > :is(#pictures-forms, #pictures-gallery-version) {
		border-bottom: 1px solid var(--background-alt-color);
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
