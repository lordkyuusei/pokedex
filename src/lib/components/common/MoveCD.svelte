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
</script>

<div id="album-{type}-{name}" style:--type-color={getPkmnTypeColor(type)}>
	<div id="{name}-cover">
		<span id="cover-type-id">
			<img src="/icons/{type}.png" alt={type} />
			<span>{id.toString().padStart(3, '0')}</span>
		</span>
		<h1 id="cover-name">{name}</h1>
		<abbr id="cover-code" style:text-shadow={drawBoxShadow(type)}>{code}</abbr>
	</div>
	<div id="{name}-disc" style:background={drawDiscCover(type)} />
</div>

<style>
	div[id^='album-'] {
		display: grid;
		grid-template: 'cover disc' 1fr / 1fr 0.5fr;
		align-items: center;
		width: 100%;

		& > div[id$='-cover'] {
			grid-area: 1 / 1;
			display: grid;
			grid-template:
				'cover-type-id' 1fr
				'cover-name' 1fr
				'cover-code' 1fr / 100%;
			align-items: center;

			height: 100%;
			padding-block: var(--small-gap);
			box-shadow: var(--box-shadow);
			border-radius: var(--border-r-100);
			background-color: var(--type-color);

			aspect-ratio: 1;
			z-index: 2;

			& > span#cover-type-id {
				width: 100%;
				display: flex;
				gap: var(--small-gap);
				align-items: center;
				justify-content: flex-start;
				padding: var(--small-gap);
				border-top: 2px solid var(--text-color);
				border-bottom: 2px solid var(--text-color);
				background-color: var(--background-second-color);

				& > img {
					inline-size: 20%;
					border-radius: var(--border-r-100);
				}

				& > span {
					font-size: x-large;
				}
			}
			& > h1#cover-name {
				margin: 0;
				font-size: 2rem;
				text-align: center;
				text-transform: uppercase;
			}

			& > abbr#cover-code {
				font-family: 'Pokemon';
				font-size: 3rem;
				text-align: center;
				color: var(--text-color);
				letter-spacing: var(--smallest-gap);
			}
		}

		& > [id$='-disc'],
		& > [id$='-disc']::after {
			border-radius: 50%;
			border: 4px solid var(--type-color);
		}

		& > [id$='-disc'] {
			position: relative;
			grid-area: 1 / 1;

			display: grid;
			grid-template: 'hole' 25% / 25%;
			place-content: center;
			height: calc(100% - var(--small-gap));
			aspect-ratio: 1;
			box-shadow: var(--box-shadow);
			transform: translateX(50%);

			&::after {
				content: '';
				box-shadow: var(--box-inner-shadow);
				background-color: var(--background-color);
			}
		}
	}

	@media (max-width: 1024px) {
		& > div[id$='-album'] {
			min-width: 50svw;
		}
	}

	@media (max-width: 640px) {
		& > div[id$='-album'] {
			min-width: 100svw;
		}
	}
</style>
