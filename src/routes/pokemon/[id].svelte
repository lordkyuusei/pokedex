<script context="module">
    export const load = async ({ page, fetch, session, stuff }) => {
        const { id } = page.params || 0;
        const result = await fetch(`/pokemon/${id}.json`);

        if (result.ok) {
            const { pokemon } = await result.json();

            return {
                props: {
                    pokemon,
                }
            };
        }
    }
</script>

<script lang="ts">
    export let pokemon = { name: "None" };
</script>

<div class="pokemon">
    <h1>{ pokemon.name }</h1>
</div>