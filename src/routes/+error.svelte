<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import PokemonLoader from '$lib/components/PokemonLayouts/PokemonLoader.svelte';
</script>

<div class="error-page">
	<h1>Something happened and I'm not sure what exactly</h1>
	<small>I know exactly what happened, you just can't see it for obvious reasons.</small>

	{#if dev}
		<h2>More details for the nerds like me</h2>
		<pre>{$page.status}: [{$page.error.message}]</pre>
	{:else}
		<h2>No details because we're in prod.</h2>
		<small>and i'm supposed to look very p r o f e s s i o n a l.</small>
		<label>Some stuff you can try:</label>
		<ul>
			<li>
				<b>If you tried to load a pokemon: </b>make sure its number is correct in the URL bar above
				(like, something between 1 and idk 900)
			</li>
			<li>
				<b>If the number is the right one: </b>the pokemon might be the problem, and it's very
				likely due to its evolution tree. i'm on it.
			</li>
		</ul>
		<p>You can try to reload something, or look at this ball. Your choice.</p>
		<PokemonLoader />
	{/if}
</div>
