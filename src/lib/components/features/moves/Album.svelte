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

	$: shadow = drawBoxShadow(type);
	$: color = getPkmnTypeColor(type);
</script>

<section id="album-{type}">
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
	<footer id="{type}-info">
		<span>{getPkmnTypeLang(type, $lang)}</span>
		<span><em>{count}</em> capacités </span>
	</footer>
</section>

<style>
	[id^='album'] {
		display: grid;
		grid-template:
			'header' 4fr
			'footer' 1fr / 100%;

		align-items: center;
		border: none;
	}

	[id^='album'] > [id$='cover'] {
		transition: all var(--transition-duration) var(--transition);
		position: relative;
		grid-area: header;
		display: grid;
		grid-template:
			'icon' 1fr
			'name' 4fr / 100%;

		aspect-ratio: 1 / 1.2;

		padding: 0.5em;
		height: 100%;
		width: 100%;
		align-items: center;
		justify-items: flex-end;
		font-family: 'Pokemon';
		border-radius: var(--border-r-100);
	}

	[id^='album'] > [id$='cover']:hover {
		transform: scale(1.05);
		box-shadow: var(--box-shadow);
		transition: all var(--transition-duration) var(--transition);
	}

	[id^='album'] > [id$='cover'] img {
		inline-size: 20%;
		border-radius: var(--border-r-50);
	}

	[id^='album'] > [id$='cover'] [class^='code'] {
		width: 100%;
		text-align: center;
		font-size: 2.5em;
		color: hsla(0, 100%, 100%, 50%);
		letter-spacing: 3px;
	}

	[id^='album'] > [id$='cover'] [class^='button'] {
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

	[id^='album'] > [id$='info'] {
		grid-area: footer;
		display: grid;
		grid-template:
			'type' 1fr
			'info' 1fr / 100%;

		text-transform: uppercase;
	}
</style>
