<script lang="ts">
	import { onMount } from 'svelte';
	import { lang } from '$lib/store/lang';

	const setLang = () => ($lang = $lang === 'en' ? 'fr' : 'en');

	onMount(() => {
		const mapUserLangToLang: Array<{ match: boolean; lang: Lang }> = [
			{ match: navigator.language.includes('fr'), lang: 'fr' },
			{ match: navigator.language.includes('en'), lang: 'en' },
			{ match: true, lang: 'en' }
		];

		const match = mapUserLangToLang.find((x) => x.match === true);
		if (match) {
			$lang = match.lang;
		}
	});
</script>

<button id="lang-switch" on:click={setLang}>{$lang}</button>

<style>
	#lang-switch {
		text-transform: capitalize;

		height: 2em;
		aspect-ratio: 1;
		padding: 0;
	}
</style>
