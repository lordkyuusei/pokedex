<script lang="ts">
	import { device } from '$lib/store/device';
	import t from '$lib/store/i18n';
</script>

<section id="home-page">
	<h1>
		{$t('home.welcome')}
	</h1>

	<blockquote>
		<cite>
			{$t('home.speech1')}
			{$t('home.speech2')}
		</cite>
		<br />
		<div>
			{$t('home.speech3')}
		</div>
	</blockquote>

	<p>
		{$t('home.' + $device)}
		{$t('home.features')}
	</p>
</section>

<style>
	#home-page {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-inline: 1rem;
		& > blockquote {
			text-align: center;
			& > div {
				text-align: end;
			}
		}
	}
</style>
