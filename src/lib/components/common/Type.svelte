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
		border-radius: var(--border-r-200);
		background-color: var(--background-color);
		box-shadow: 0 0 10px 2px var(--background-alt-color);
		width: 100%;
	}

	img {
		grid-area: icon;

		width: 3rem;
		border-radius: var(--border-r-200);
		box-shadow: 0 0 5px 2px var(--background-color);
	}

	p {
		grid-area: text;

		margin: 0;
		text-transform: uppercase;
		letter-spacing: 3px;
	}
</style>
