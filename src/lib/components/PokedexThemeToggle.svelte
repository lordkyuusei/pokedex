<script context="module">
	export const prerendering = true;
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	const { setTheme } = getContext('theme');
	let isChecked: boolean = false;
</script>

<label class="pokedex-theme">
	<input
		type="checkbox"
		class="theme-switch"
		bind:checked={isChecked}
		name="theme"
		on:click={setTheme}
	/>
	<span class="theme-icon" class:checked={isChecked} class:unchecked={!isChecked} />
</label>

<style scoped>
	.pokedex-theme {
		display: block;
		width: 50px;
		height: 15px;
		position: relative;
		border-radius: 25px;
		background-color: var(--theme-text);
	}
	.theme-switch {
		position: absolute;
		opacity: 0;
		top: 0;
		left: 0;
		width: 100%;
	}
	.theme-icon {
		position: absolute;
		top: -10px;
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	.checked {
		transform: translateX(-10px);
		height: 32px;
		width: 36px;
		background: url('/moon.png') no-repeat center center;
		background-size: cover;
	}
	.unchecked {
		transform: translateX(30px);
		height: 35px;
		width: 35px;
		background: url('/sun.png') no-repeat center center;
		background-size: cover;
	}
</style>
