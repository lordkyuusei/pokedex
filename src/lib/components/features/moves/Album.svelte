<script lang="ts">
	import drawBookBackground, {
		drawBoxShadow,
		getPkmnTypeTranslation,
		getPkmnTypeColor,
		getPkmnTypeLang
	} from '$lib/functions/drawBackgroundFromTypes';
	import { lang } from '$lib/store/lang';

	export let type: string;
	export let count: number;
	export let showFooter: boolean = true;

	$: shadow = drawBoxShadow(type);
	$: color = getPkmnTypeColor(type);
</script>

<div id="album-{type}" class:show-footer={showFooter}>
	<header id="{type}-cover" style:background={color}>
		<img style:box-shadow={shadow} src="/icons/{type}.png" alt={type} />
		<span class="code-{type}" style:text-shadow={shadow}>
			{getPkmnTypeTranslation(type)?.substring(0, 5)}
		</span>
		<span class="button-{type}">
			<svg width="16.604" height="15.743" viewBox="1500.396 1568.225 16.604 15.743">
				<path
					style:fill={getPkmnTypeColor(type)}
					d="M1501.500,1568.565C1503.092,1566.622,1516.981,1573.537,1517.000,1576.065C1517.020,1578.652,1502.976,1585.719,1501.500,1583.565C1500.183,1581.643,1499.881,1570.541,1501.500,1568.565Z"
				/>
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

		grid-template: 'header' 100% / 100%;

		&.show-footer {
			grid-template:
				'header' 4fr
				'footer' 1fr / 100%;
		}

		align-items: center;
		border: none;

		& > header[id$='cover'] {
			grid-area: header;
			position: relative;
			display: grid;
			grid-template:
				'icon' 1fr
				'name' 4fr / 100%;
			align-items: center;
			justify-items: flex-end;

			font-family: 'Pokemon';
			aspect-ratio: 1 / 1.2;

			padding: var(--smaller-gap);
			box-shadow: var(--box-shadow);
			border-radius: var(--border-r-100);
			transition: all var(--transition-duration) var(--transition-function);

			&:hover {
				filter: brightness(1.2);
				transition: filter var(--transition-duration) var(--transition-function);
			}

			& > img {
				inline-size: 20%;
				border-radius: var(--border-r-50);
			}

			& > span[class^='code'] {
				width: 100%;
				text-align: center;
				font-size: 2.5rem;
				color: var(--text-color);
				letter-spacing: calc(var(--smallest-gap) / 2);
			}
			& > span[class^='button'] {
				position: absolute;
				display: grid;
				place-content: center;
				bottom: 0;
				right: 0;
				height: 3em;
				aspect-ratio: 1;
				border-radius: var(--border-r-100);
				background-color: hsla(0, 100%, 0%, 50%);
				transform: translate(-25%, 50%);
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
