<script lang="ts">
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import onImgError from '$lib/functions/fixImgLoadingError';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';

	export let name: string;
	export let id: number;
	export let types: string[];
	export let landscape: boolean = false;
</script>

<article id="book-{id}" class:landscape style:background={drawBookBackground(types)}>
	<header class="book-picture">
		<img
			alt={name}
			src={fetchPokemonSpriteURL(id, 'icons', 'generation-viii')}
			on:error={onImgError}
		/>
	</header>
	<p class="book-name">{name}</p>
	<footer class="book-number">{id.toString().padStart(4, '0')}</footer>
</article>

<style>
	article[id^='book'] {
		display: grid;
		grid-template: 'picture' 1fr 'name' 3fr 'number' 1fr / auto;
		justify-items: center;
		justify-content: center;
		gap: var(--normal-gap);

		width: fit-content;
		aspect-ratio: 3 / 9;
		position: relative;
		color: var(--text-color);

		transform-origin: bottom;
		padding-block: var(--smaller-gap);
		border-radius: var(--border-r-25) var(--border-r-25) 0 0;
		transition: all var(--transition-duration) linear;
		box-shadow: var(--box-shadow);

		&:not(.landscape) {
			perspective: 100px;
			transform-style: preserve-3d;

			&:hover {
				transform: rotateX(-35deg) rotateY(-1.8deg) rotateZ(-1.4deg);
				border-radius: 0;

				&::before {
					content: '';
					position: absolute;
					top: -6.96rem;
					width: 100%;
					aspect-ratio: 3 / 4;
					background: var(--book-pages-background);
					border: var(--smaller-gap) solid var(--background-color);
					border-top: none;
					transform: rotateX(35deg);
					transform-origin: inherit;
				}
			}

			& > .book-picture {
				margin-inline: var(--smaller-gap);
			}
		}

		&.landscape {
			grid-template: 'picture name number' auto / 1fr 3fr 1fr;
			align-items: center;
			justify-items: start;
			width: auto;
			aspect-ratio: 9 / 1;
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
			border-radius: var(--border-r-25);
			background-color: hsla(0, 0%, 100%, 20%);

			& > img {
				width: 100%;
				min-width: 68px;

				&.img-error {
					width: 65%;
				}
			}
		}

		& > .book-name {
			writing-mode: vertical-lr;
			transform: rotate(180deg);
			letter-spacing: 5px;
			text-transform: uppercase;
			font-weight: bold;
			text-shadow: 0 0 5px var(--background-color);
		}

		& > .book-number {
			display: grid;
			place-content: center;
			font-weight: bold;
			letter-spacing: 3px;
			text-shadow: 0px 1px 2px var(--background-color);
			height: 2em;
			width: 100%;
			color: white;
			background-color: var(--background-blur-second-color);
		}
	}
</style>
