<script lang="ts">
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import onImgError from '$lib/functions/fixImgLoadingError';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	export let name: string;
	export let id: number;
	export let types: string[];
	export let landscape: boolean = false;
</script>

<div id="book-{id}" class:landscape style:background={drawBookBackground(types)}>
	<header class="book-picture">
		<img
			src={fetchPokemonSpriteURL(id, 'icons', 'generation-viii')}
			alt={name}
			on:error={onImgError}
		/>
	</header>
	<p class="book-name">{name}</p>
	<footer class="book-number">{id.toString().padStart(4, '0')}</footer>
</div>

<style>
	[id^='book'] {
		position: relative;
		display: flex;
		flex-direction: column;
		place-items: center;
		place-content: space-between;
		color: var(--text-color);
		gap: var(--normal-gap);

		cursor: pointer;
		padding-block: var(--smaller-gap);
		border-radius: var(--border-r-25) var(--border-r-25) 0 0;
		transform-origin: bottom;
		transition: all var(--transition-duration) linear;

		&:not(.landscape) {
			perspective: 100px;
			transform-style: preserve-3d;
			box-shadow: var(--box-shadow);

			&:hover {
				transform: rotateX(-50deg);
				border-radius: 0;

				&::before {
					content: '';
					position: absolute;
					top: -5rem;
					height: 5rem;
					width: 100%;
					background: var(--book-pages-background);
					border: 0.25rem solid var(--background-color-__);
					border-top: none;
					transform: rotateX(30deg);
					transform-origin: bottom;
				}
			}
		}

		&.landscape {
			flex-direction: row;
			border-radius: var(--border-r-50);
			padding-inline: var(--smaller-gap);

			& > .book-name {
				writing-mode: initial;
				transform: rotate(0);
			}
			& > .book-number {
				background: none;
				justify-content: flex-end;
			}
		}

		& > .book-picture {
			background-color: hsla(0, 0%, 100%, 20%);
			border-radius: var(--border-r-25);
		}

		& > .book-name {
			writing-mode: vertical-lr;
			transform: rotate(180deg);
			letter-spacing: 5px;
			text-transform: uppercase;
			font-weight: bold;
			text-shadow: 0 0 5px var(--background-color-_);
		}

		& > .book-number {
			display: grid;
			place-content: center;
			font-weight: bold;
			letter-spacing: 3px;
			text-shadow: 0px 1px 2px var(--background-color-_);
			height: 2em;
			width: 100%;
			color: white;
			background-color: rgb(0 0 0 / 0.5);
		}
	}
</style>
