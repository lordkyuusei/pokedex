<script lang="ts">
	import {
		drawBoxShadow,
		getPkmnTypeTranslation,
		getPkmnTypeColor,
		getPkmnTypeLang
	} from '$lib/functions/drawBackgroundFromTypes';
	import { lang } from '$lib/store/lang';

	export let type: string;
	export let count: number;
	export let showFooter: boolean = true;

	let shadow = drawBoxShadow(type);
	let color = getPkmnTypeColor(type);
</script>

<div id="album-{type}" class:show-footer={showFooter}>
	<header id="{type}-cover" style:background={color}>
		<img alt={type} style:box-shadow={shadow} src="/icons/{type}.png" />
		<span class="code-{type}" style:text-shadow={shadow}>
			{getPkmnTypeTranslation(type)?.substring(0, 5)}
		</span>
		<span class="button-{type}">
			<svg style:fill={getPkmnTypeColor(type)}>
				<use href="#icon-player"></use>
			</svg>
		</span>
	</header>
	{#if showFooter}
		<footer id="{type}-info">
			<span>{getPkmnTypeLang(type, $lang)}</span>
			<span><em>{count}</em> capacités </span>
		</footer>
	{/if}
</div>

<style>
	div[id^='album'] {
		display: grid;
		align-items: center;

		width: 100%;
		&:not(.show-footer) {
			grid-template: 'header' 1fr / 100%;
		}

		&.show-footer {
			grid-template:
				'header' 4fr
				'footer' 1fr / 100%;
		}

		& > header[id$='cover'] {
			grid-area: header;
			position: relative;

			display: grid;
			grid-template: 1fr 4fr 1px / 1.5fr 1fr;
			align-items: center;
			justify-items: flex-end;

			aspect-ratio: 1 / 1.2;

			padding: var(--smaller-gap) var(--smaller-gap) 0 var(--smaller-gap);
			box-shadow: var(--box-shadow);
			border-radius: var(--border-r-100);
			transition: all var(--transition-duration) var(--transition-function);

			&:hover {
				filter: brightness(1.2);
				transition: filter var(--transition-duration) var(--transition-function);
			}

			& > img {
				grid-area: 1 / 2 / 1 / 2;
				width: 50%;
				border-radius: var(--border-r-50);
			}

			& > span[class^='code'] {
				grid-area: 2 / 1 / 2 / 3;
				width: 100%;
				text-align: center;
				font-family: 'Pokemon';
				font-size: 2.5em;
				color: var(--text-color);
				letter-spacing: calc(var(--smallest-gap) / 2);
			}

			& > span[class^='button'] {
				grid-area: 3 / 2 / 3 / 2;
				display: grid;
				place-items: center;
				height: 3em;
				aspect-ratio: 1;
				border-radius: var(--border-r-100);
				margin-inline: auto;
				background-color: hsla(0, 100%, 0%, 50%);

				& > svg {
					height: 50%;
				}
			}
		}

		& > [id$='info'] {
			grid-area: footer;
			display: grid;
			grid-template:
				'type' 1fr
				'info' 1fr / 100%;

			text-transform: uppercase;
			padding-inline: var(--small-gap);
		}
	}
</style>
