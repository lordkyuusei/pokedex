<script lang="ts">
	import { dev } from '$app/env';
	import { onMount } from 'svelte';

	onMount(() => {
		let canvas = document.getElementById('map') as HTMLCanvasElement;
		let ctx = canvas.getContext('2d');
		ctx.beginPath();

		ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
		ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2 - 10);
		ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 16, 0, 2 * Math.PI);

		ctx.stroke();
	});
</script>

<div class="experiments">
	{#if dev}
		<h1>Playground</h1>
		<canvas id="map" width="400" height="400" />
	{:else}
		<a href="https://youtube.com/watch?v=NzSr8X_hHVU">Le bug de l'an 2000</a>
	{/if}
</div>

<style>
</style>
