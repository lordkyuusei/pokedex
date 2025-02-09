<script lang="ts">
	import {
		drawBoxShadow,
		drawDiscCover,
		getPkmnTypeColor
	} from '$lib/functions/drawBackgroundFromTypes';

	export let id: number;
	export let type: string;
	export let name: string;
	export let code: string;

	let typeColor = getPkmnTypeColor(type);
	let textShadow = drawBoxShadow(type);
	let background = drawDiscCover(type);
</script>

<div id="album-{type}-{name}" style:--type-color={typeColor} style:--disc-color={background}>
	<span id="cover-type-id">
		<img src="/icons/{type}.png" alt={type} />
		<span>{id.toString().padStart(3, '0')}</span>
	</span>
	<h1 id="cover-name">{name}</h1>
	<abbr id="cover-code" class="pokemon-font" style:text-shadow={textShadow}>{code}</abbr>
</div>

<style>
	div[id^="album"] {
		display: grid;
		grid-template:
			'band band band band band' 0.5fr
			'name name name name name' 1fr
			'code code code code code' 1fr / 1fr 1fr 1fr 1fr 1fr;

		aspect-ratio: 1;
		position: relative;
		padding-block: var(--normal-gap);
		border-radius: var(--border-r-100);
		background-color: var(--type-color);

		@media (max-width: 1024px) {
			width: 70%;
		}

		& > span#cover-type-id {
			grid-area: band;
			display: grid;
			grid-template: auto / auto 1fr;
			justify-content: start;
			align-items: center;
			gap: var(--small-gap);

			border-top: 1px solid var(--second-color);
			border-bottom: 1px solid var(--second-color);
			padding: var(--normal-gap) var(--small-gap);
			background-color: var(--background-blur-second-color);
			z-index: 2;

			& > img {
				width: 50%;
			}

			& > span {
				font-size: x-large;
			}
		}

		& > h1#cover-name {
			grid-area: name;
			text-align: center;
			margin-block: auto;
			font-size: x-large;
			z-index: 2;
		}

		& > abbr#cover-code {
			grid-area: code;
			text-align: center;
			font-size: 2.5em;
			z-index: 2;
			font-family: 'Pokemon';
		}

		&::before {
			content: "";
			height: 100%;
			grid-area: 1 / 1 / -1 / -1;
			background-color: var(--type-color);
			z-index: 1;
		}

		&::after {
			content: "";
			grid-area: 1 / 4 / 4 / 5;
			aspect-ratio: 1;
			border-radius: 50%;
			z-index: 1;
			height: 100%;
			background: var(--disc-color);
			border: 1rem solid var(--background-second-color);
			z-index: 0;
		}
	}
</style>
