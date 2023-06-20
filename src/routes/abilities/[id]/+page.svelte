<svelte:options immutable />

<script lang="ts">
	import { fetchPokemonSpriteURL } from '$lib/api/fetch';
	import { generation } from '$lib/store/generation';
	import { lang } from '$lib/store/lang';
	import type { PageData } from './$types';

	export let data: PageData;

	$: flavor = data.ability.flavor_text_entries.find((x) => x.language.name === $lang)?.flavor_text;
	$: effect = data.ability.effect_entries.find((x) => x.language.name === $lang)?.effect ?? '';
	$: pokemonMainAbility = data.ability.pokemon.filter((x) => x.is_hidden === false);
	$: pokemonHiddenAbility = data.ability.pokemon.filter((x) => x.is_hidden === true);

	$: changes = data.ability.effect_changes.filter((x) => {
		const gen = data.generationsList.find(
			(l) => l.versionsGroup.some((g) => g.name.includes(x.version_group.name)) && l.id !== 0
		);

		if (gen) {
			return gen.id >= $generation.id;
		}

		return false;
	});

	$: console.log(changes);
</script>

<section id="ability-details">
	<h1>Description</h1>
	<p>{flavor}</p>

	<h1>Effet détaillé en combat</h1>
	<p>{effect}</p>

	{#if changes.length}
		<h1>Changements au fil des générations</h1>
		{#each changes as change}
			<p>
				Avant <em
					>{change.version_group.name}, {data.ability.name} {change.effect_entries[1].effect}</em
				>
			</p>
		{/each}
	{/if}

	<section id="details-pokemon-normal">
		<h1>Pokémon l'ayant en talent</h1>
		<div>
			{#each pokemonMainAbility as { pokemon }}
				<a href="/pokemon/{pokemon.url.split('/').at(-2)}/stats">
					<img
						src={fetchPokemonSpriteURL(pokemon.url.split('/').at(-2), 'icons', 'generation-viii')}
						alt={pokemon.name}
					/>
				</a>
			{/each}
		</div>
	</section>

	<section id="details-pokemon-hidden">
		<h1>Pokémon l'ayant en talent caché</h1>
		<div>
			{#each pokemonHiddenAbility as { pokemon }}
				<a href="/pokemon/{pokemon.url.split('/').at(-2)}/stats">
					<img
						src={fetchPokemonSpriteURL(pokemon.url.split('/').at(-2), 'icons', 'generation-viii')}
						alt={pokemon.name}
					/>
				</a>
			{/each}
		</div>
	</section>
</section>

<style>
	#ability-details {
		display: flex;
		flex-direction: column;
		padding-block: 1em;
		padding-inline: 4em;
		height: 100%;
		width: 100%;
	}

	#ability-details > [id^='details-'] {
		grid-area: table;
		display: grid;
		grid-template:
			'h1' auto
			'pokemon' 100% / 100%;
		column-gap: 0.5em;
		row-gap: 2em;

		overflow-y: auto;
		width: 100%;
		height: 100%;
	}

	#ability-details > [id^='details-'] h1 {
		grid-area: h1;
		font-size: 2em;
		margin: 0;
	}

	#ability-details > [id^='details-'] div {
		grid-area: pokemon;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5em, 1fr));
		column-gap: 0.5em;
		height: 100%;
		width: 100%;
		overflow-y: scroll;
	}
</style>
