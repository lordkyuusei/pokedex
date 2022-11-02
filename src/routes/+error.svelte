<script lang="ts">
	import { page } from '$app/stores';
	import { dev } from '$app/environment';
	import Loader from '$lib/components/shared/Loader.svelte';
</script>

<div class="error-page">
	{#if $page.status === 404}
		<h1>404.</h1>
		<small><i>That's an error.</i></small>
		<p>The resource you tried to look for doesn't exist.</p>
		<Loader />
	{:else}
		<h1>Something happened and I'm not sure what exactly</h1>
		<small>I know exactly what happened, you just can't see it for obvious reasons.</small>

		{#if dev}
			<h2>More details for the nerds like me</h2>
			<pre>{$page.status}: [{$page.error.message}]</pre>
		{:else}
			<h2>No details because we're in prod.</h2>
			<small>and i'm supposed to look very p r o f e s s i o n a l.</small>
		{/if}
	{/if}
</div>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.error-page h1 {
		font-size: xx-large;
		font-weight: bolder;
	}
</style>
