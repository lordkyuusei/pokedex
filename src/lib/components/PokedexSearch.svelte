<script lang="ts">
	import PokemonCard from './PokemonCard.svelte';
	type light = {
		id: number;
		name: string;
		types: string[];
	};

	let searchText: string = '';
	let searchResults: light[] = [];

	const search = async (event: KeyboardEvent): Promise<void> => {
		if (event.key === 'Enter') {
			const response = await fetch('/lightkedex.json');
			const data = await response.json();
			searchResults = data.filter((item: light) =>
				item.name.toLowerCase().includes(searchText.toLowerCase())
			);
		}
	};
</script>

<input
	type="text"
	name="search"
	placeholder="Search Pokemon"
	bind:value={searchText}
	on:keyup={(event) => search(event)}
/>
<div class="pokemon-list">
	{#each searchResults as pokemon}
		<a href="/pokemon/{pokemon.id}" on:click={() => (searchResults = [])}>
			<PokemonCard id={`${pokemon.id}`} name={pokemon.name} types={pokemon.types} />
		</a>
	{/each}
</div>

<style scoped>
	input {
		border-width: 0 0 2px 0;
		border-style: solid;
		border-color: var(--theme-text);
		background-color: transparent;
		width: 100%;
		height: 100%;
		font: inherit;
	}

	input:focus {
		outline: none;
	}

	.pokemon-list {
		position: absolute;
		left: 1rem;
		width: auto;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		align-content: center;
		justify-content: center;
		align-items: center;
		margin: 0 -1rem;
		background-color: var(--theme-background);
		border-radius: 10px;
		z-index: 2;
	}
</style>
