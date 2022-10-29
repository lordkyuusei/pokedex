<script context="module">
	export const load = ({ error, status }) => ({ props: { error, status } });
</script>

<script lang="ts">
	import PokemonLoader from '$lib/components/PokemonLayouts/PokemonLoader.svelte';
	import { dev } from '$app/environment';

	export let error: Error;
	export let status: number;
</script>

<div class="error-page">
	<h1>Something happened and I'm not sure what exactly</h1>
	<small>it happens, sometimes, no big deal</small>

	{#if dev}
		<h2>More details for the nerds like me</h2>
		<pre>{status}: [{error?.name}] - {error?.message}<br /> {error?.stack}</pre>
	{:else}
		<h2>No details because we're in prod.</h2>
		<small>and i'm supposed to look very p r o f e s s i o n a l.</small>
		<p>You can try to reload something, or look at this ball. Your choice.</p>
		<PokemonLoader />
	{/if}
</div>
