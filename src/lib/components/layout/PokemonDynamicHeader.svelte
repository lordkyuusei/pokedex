<script lang="ts">
	import pokemon from '$lib/store/pokemon';
	import { lang } from '$lib/store/lang';

	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	const LAST_POKEMON_KNOWN_ID: number = 1017;

	let pokemonLocalName: string;

	$: if ($pokemon?.names) {
		pokemonLocalName = $pokemon.names.find((x) => x.language.name === $lang)?.name ?? '';
	}
</script>

<section id="dex-pokemon-header">
	{#if $pokemon?.id}
		{#if $pokemon.id - 1 !== 0}
			<a href="/pokemon/{$pokemon.id - 1}/stats">
				<button class="navigation-button" title={`${$pokemon.id + 1}`}>
					<img class="navigation-prev" src="/arrow.svg" alt="pokemon {$pokemon.id - 1}" />
					<img
						class="pokemon-sprite"
						src={fetchPokemonSpriteURL($pokemon.id - 1, 'icons', 'generation-viii')}
						alt="pokemon {$pokemon.id - 1}"
					/>
				</button>
			</a>
		{/if}
		<h1 class="header-name">{pokemonLocalName}</h1>
		{#if $pokemon?.id !== LAST_POKEMON_KNOWN_ID}
			<a href="/pokemon/{$pokemon.id + 1}/stats">
				<button class="navigation-button" title={`${$pokemon.id + 1}`}>
					<img
						class="pokemon-sprite"
						src={fetchPokemonSpriteURL($pokemon.id + 1, 'icons', 'generation-viii')}
						alt="pokemon {$pokemon.id + 1}"
					/>
					<img src="/arrow.svg" class="navigation-next" alt="pokemon {$pokemon.id + 1}" />
				</button>
			</a>
		{/if}
	{/if}
</section>

<style>
	#dex-pokemon-header {
		display: flex;
		align-items: center;
		gap: var(--small-gap);
	}

	.header-name {
		font-size: 1.8em;
		text-align: center;
		background-color: var(--background-accent);
		text-transform: uppercase;
		padding: 0.7em 1em;
		min-width: 5em;
		letter-spacing: 2px;
		border-radius: var(--border-r-200);
	}

	.navigation-button {
		background-color: var(--text-color);
		border-radius: var(--border-r-200);
		border: none;
		cursor: pointer;
		display: grid;
		grid-template: 100% / 1fr 1fr;
		place-items: center;
	}

	.pokemon-sprite {
		object-fit: cover;
		object-position: 0px -5px;
	}

	.navigation-next {
		transform: rotate(180deg);
	}
</style>
