<script lang="ts">
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	export let name: string;
	export let id: number;
	export let types: string[];
	export let landscape: boolean = false;
</script>

<section id="book-{id}" class:landscape style:background={drawBookBackground(types)}>
	<header class="book-picture">
		<img
			src={fetchPokemonSpriteURL(id, 'icons', 'generation-viii')}
			alt={name}
			on:error={({ target }) => (target.src = fetchPokemonSpriteURL(0))}
		/>
	</header>
	<p class="book-name">{name}</p>
	<footer class="book-number">{id.toString().padStart(4, '0')}</footer>
</section>

<style>
	[id^='book'] {
		color: white;
		display: flex;
		flex-direction: column;
		place-items: center;
		place-content: space-between;
		gap: var(--normal-gap);

		border-radius: var(--border-r-50) var(--border-r-50) 0 0;
		padding-block: 0.5em;
		transition: transform 0.2s ease-in-out;
		cursor: pointer;
	}

	[id^='book']:hover {
		animation: float 0.2s ease-in-out infinite alternate;
	}

	[id^='book'] .book-picture {
		background-color: hsla(0, 0%, 100%, 20%);
		border-radius: var(--border-r-50);
	}

	[id^='book'] .book-name {
		writing-mode: vertical-lr;
		transform: rotate(180deg);
		letter-spacing: 5px;
		text-transform: uppercase;
		font-weight: bold;
		text-shadow: 0 0 5px hsl(0, 0%, 20%);
	}

	[id^='book'] .book-number {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		letter-spacing: 3px;
		text-shadow: 0px 1px 2px black;
		height: 2em;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.5);
	}

	[id^='book'].landscape {
		flex-direction: row;
		border-radius: var(--border-r-50);
		padding-inline: 0.5em;
	}

	[id^='book'].landscape .book-name {
		writing-mode: initial;
		transform: rotate(0);
	}

	[id^='book'].landscape .book-number {
		background: none;
		justify-content: flex-end;
	}

	@keyframes float {
		0% {
			transform: translateY(-4px);
		}
		100% {
			transform: translateY(-8px);
		}
	}
</style>
