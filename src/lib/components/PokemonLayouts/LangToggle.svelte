<script lang="ts">
	import { onMount } from 'svelte';

	import { browser } from '$app/env';
	import { locale, locales } from '$lib/store/i18n/i18n';

	const updateLocale = () => localStorage.setItem('locale', $locale);
	onMount(() => {
		if (browser) {
			$locale = localStorage.getItem('locale') || 'english';
		}
	});
</script>

<div class="lang-toggle">
	<select bind:value={$locale} on:change={() => updateLocale()}>
		{#each locales as locale}
			<option value={locale}>{locale}</option>
		{/each}
	</select>
</div>

<style>
	select,
	option {
		font-size: 1rem;
		padding: 0.5rem 1rem;
		margin: 0.5rem;
		border-radius: 50px;
		text-transform: uppercase;
		letter-spacing: 0.25rem;
		background-color: var(--theme-background);
		color: var(--theme-text);
	}
</style>
