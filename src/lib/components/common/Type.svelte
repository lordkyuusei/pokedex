<script lang="ts">
	import { lang } from '$lib/store/lang';
	import { getPkmnTypeLang } from '$lib/functions/drawBackgroundFromTypes';

	export let type: string;
</script>

<section class="pokemon-type">
	<img src="/icons/{type}.png" alt={type} />
	<p>{getPkmnTypeLang(type, $lang)}</p>
</section>

<style>
	.pokemon-type {
		display: grid;
		grid-template: 'icon text' auto / 1fr 5fr;
		place-items: center;
		place-content: center;
		padding: var(--smallest-gap);
		border-radius: var(--border-r-50);
		background-color: var(--background-color);
		box-shadow: var(--box-shadow);
	}

	img {
		grid-area: icon;

		width: 2.5rem;
		border-radius: calc(var(--border-r-50) - var(--smallest-gap));
	}

	p {
		grid-area: text;

		margin: 0;
		text-transform: uppercase;
		letter-spacing: 4px;
	}
</style>
