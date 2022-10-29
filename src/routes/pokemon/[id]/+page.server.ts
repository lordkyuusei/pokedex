import { error } from "@sveltejs/kit";

export const load = async ({ params, fetch }) => {
    const { id } = params || 0;
    const result = await fetch(`/api/pokemon/${id}`);

    if (result.ok) {
        const { pokemon, specie } = await result.json();

        return {
            pokemon,
            specie
        };
    } else {
        throw error(404, "Pokemon not found");
    }
};
