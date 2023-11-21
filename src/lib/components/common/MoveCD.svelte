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

<section id="album-{type}-{name}" style:--type-color={getPkmnTypeColor(type)}>
	<div id="{name}-cover">
		<span id="cover-type-id">
			<img src="/icons/{type}.png" alt={type} style:box-shadow={drawBoxShadow(type)} />
			<span>{id.toString().padStart(3, '0')}</span>
		</span>
		<h1 id="cover-name">{name}</h1>
		<abbr id="cover-code" style:text-shadow={drawBoxShadow(type)}>{code}</abbr>
	</div>
	<div
		id="{name}-disc"
		style:box-shadow={drawBoxShadow(type)}
		style:background={drawDiscCover(type)}
	/>
</section>

<style>
	[id^='album-'] {
		display: grid;
		grid-template: 'cover disc' 1fr / 1fr 0.5fr;
		align-items: center;
	}

	[id^='album-'] > [id$='-cover'] {
		display: grid;
		grid-template:
			'cover-type-id' 1fr
			'cover-name' 1fr
			'cover-code' 1fr / 100%;

		grid-row: 1;
		grid-column: 1;
		align-items: center;
		padding-block: 1rem;
		z-index: 2;
		height: 100%;
		aspect-ratio: 1;
		background-color: var(--type-color);
		border: 2px solid var(--text-color);
		border-radius: var(--border-r-100);
	}

	[id^='album-'] > [id$='-cover'] > #cover-type-id {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		gap: var(--small-gap);
		padding: 0.5rem;
		background-color: hsla(0, 100%, 100%, 20%);
	}

	[id^='album-'] > [id$='-cover'] > #cover-type-id img {
		inline-size: 20%;
		border-radius: var(--border-r-100);
	}

	[id^='album-'] > [id$='-cover'] > #cover-type-id span {
		font-size: 1.5em;
	}

	[id^='album-'] > [id$='-cover'] > #cover-name {
		margin: 0;
		font-size: 1.5em;
		text-align: center;
		text-transform: uppercase;
	}

	[id^='album-'] > [id$='-cover'] > #cover-code {
		font-family: 'Pokemon';
		font-size: 3em;
		text-align: center;
		letter-spacing: 1rem;
		color: hsla(0, 100%, 100%, 50%);
	}

	[id^='album-'] > [id$='-disc'],
	[id^='album-'] > [id$='-disc']::after {
		border-radius: 50%;
		border: 4px solid var(--type-color);
	}

	[id^='album-'] > [id$='-disc'] {
		grid-row: 1;
		grid-column: 1;
		display: grid;
		grid-template: 'hole' 25% / 25%;
		place-content: center;
		aspect-ratio: 1;
		height: calc(100% - 1em);
		position: relative;
		transform: translateX(50%);
	}

	[id^='album-'] > [id$='-disc']::after {
		content: '';
		background-color: var(--background-color-___);
	}
</style>
