<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import themes from '$lib/store/themes/themes';
	import { browser } from '$app/environment';

	export let presets = [...themes];

	let currentTheme = presets[0].name;

	const getCurrentTheme = (name: string) => presets.find((theme) => theme.name === name);
	const theme = writable(getCurrentTheme(currentTheme));

	setContext('theme', {
		theme,
		setTheme: () => {
			let index = presets.findIndex((theme) => theme.name === currentTheme);
			currentTheme = presets[index === presets.length - 1 ? 0 : (index += 1)].name;
			theme.update((t) => ({ ...t, ...getCurrentTheme(currentTheme) }));
			if (browser) {
				localStorage.setItem('currentTheme', currentTheme);
			}
			setRootColors(getCurrentTheme(currentTheme));
		}
	});

	onMount(() => {
		currentTheme = localStorage.getItem('currentTheme') || presets[0].name;
		setRootColors(getCurrentTheme(currentTheme));
	});

	const setRootColors = (theme: { name: string; style: { [key: string]: string } }) => {
		for (let [prop, color] of Object.entries(theme.style)) {
			document.documentElement.style.setProperty(`--theme-${prop}`, color);
		}
		document.documentElement.style.setProperty(`--theme-name`, theme.name);
	};
</script>

<slot />
