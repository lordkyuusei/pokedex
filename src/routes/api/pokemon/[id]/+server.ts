import * as pokeapi from '$lib/api';

export const GET = async ({ params }) => {
    const pokemon = await pokeapi.fetchPokemonInfo(params.id);
    const { name } = pokemon?.species;
    const specie = await pokeapi.fetchPokemonSpecie(name);

    return new Response(JSON.stringify({
        pokemon,
        specie
    }));
};
