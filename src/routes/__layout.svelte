<script lang="ts">
	import PokemonThemeToggle from '$lib/components/PokemonThemeToggle.svelte';
	import ThemeContext from '$lib/contextes/ThemeContext.svelte';
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<ThemeContext>
	<PokemonThemeToggle />
	<main>
		<slot />
	</main>
</ThemeContext>

<style scoped>
	main {
		background-color: var(--theme-background);
		padding: 1em;
	}
</style>
