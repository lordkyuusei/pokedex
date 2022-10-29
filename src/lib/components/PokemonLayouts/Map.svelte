<script lang="ts">
	import { browser } from '$app/environment';

	export let version: string;
	export let POI: { lat: number; long: number }[];

	const maps = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar'];

	$: draw = drawMapFromVersion(version);

	const getMapFromVersion = (version: string) => {
		if (!version) return 'kanto';
		const mapToConditions = [
			{ cond: ['red', 'blue', 'yellow', 'firered', 'leafgreen'].includes(version), res: 'kanto' },
			{
				cond: ['gold', 'silver', 'crystal', 'heartgold', 'soulsilver'].includes(version),
				res: 'johto'
			},
			{
				cond: ['ruby', 'sapphire', 'emerald', 'omega-ruby', 'alpha-sapphire'].includes(version),
				res: 'hoenn'
			},
			{ cond: ['diamond', 'pearl', 'platinum'].includes(version), res: 'sinnoh' },
			{ cond: ['black', 'white', 'black-2', 'white-2'].includes(version), res: 'unova' },
			{ cond: ['x', 'y'].includes(version), res: 'kalos' },
			{ cond: ['sun', 'moon', 'ultra-sun', 'ultra-moon'].includes(version), res: 'alola' },
			{ cond: ['sword', 'shield'].includes(version), res: 'galar' }
		];

		return mapToConditions.find((checks) => checks.cond === true).res;
	};

	const drawMapFromVersion = (version: string) => {
		const map = getMapFromVersion(version);

		if (browser) {
			const canvas: HTMLCanvasElement = document.getElementById('pokemon-map') as HTMLCanvasElement;
			if (canvas) {
				const context = canvas.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height);

				const mapImage = new Image();
				mapImage.src = `/maps/${map}-map.webp`;
				mapImage.onload = () => {
					context.drawImage(mapImage, 0, 0);
				};
				const mapBall = new Image();
				mapBall.src = `/pointing_hand.png`;
				mapBall.onload = () => {
					context.drawImage(mapBall, 25, 25);
				};
			}
		}
	};
</script>

<div class="pokemon-map">
	<canvas id="pokemon-map" />
	<!-- <img src="/maps/{map}-map.webp" alt="{map}'s map" /> -->
</div>

<style>
	.pokemon-map {
		display: flex;
		height: 100%;
		place-content: center;
	}
	img {
		image-rendering: pixelated;
	}
</style>
