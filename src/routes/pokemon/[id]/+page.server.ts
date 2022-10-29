export const load = async ({ params, fetch }) => {
    const { id } = params || 0;
    const result = await fetch(`/api/pokemon/${id}`);

    console.log(result);
    if (result.ok) {
        const { pokemon, specie } = await result.json();

        return {
            pokemon,
            specie
        };
    }
};
