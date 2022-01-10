<div class="index" style="display: block">
	<h1>Kyuukedex</h1>
	<small>The (soon) ultimate SPA Pokedex.</small>

	<h2>Features</h2>
	<ul>
		<li>An infinite-scroll, lazy-loading complete Pokedex.</li>
		<li>A detail page where you can (currently) check:</li>
		<ul>
			<li>Any Pokemon default picture, typing, stats and evolution family.</li>
			<li>High final stat product using EV - IV - Level sliders</li>
			<li>Complete Moveset (name, power, type...) sort by game & method!</li>
			<li>Abilities (hidden ones are marked with a *)</li>
			<li>Alternate forms & varieties with clickable links!</li>
		</ul>
		<li>A (Moon/Sun stone)-inspired dark & light theme!</li>
	</ul>
	<h2>Known bugs</h2>
	<small>Honestly, a sh*t ton</small>
	<ul>
		<li>Horizontal scroll makes the scrollbar huge</li>
		<li>Forms & Varieties are badly displayed</li>
		<li>Some alternate forms (hi alolan vulpix) evolution chains are wrong</li>
	</ul>
	<h2>Why</h2>
	<p>Go <a href="/about">here</a> to know more about this app!</p>
	<h2>You can run the app too!</h2>
	<code>
		git clone https://github.com/lordkyuusei/pokedex<br />npm install && npm run dev
	</code>

	<h2>License</h2>
	<small>The Unlicense license.</small>
</div>

<style>
	code {
		display: block;
		white-space: pre-wrap;
		background-color: var(--theme-cardglass);
		padding: 1em;
		border: 1px solid var(--theme-text);
		border-radius: 5px;
		width: fit-content;
	}
</style>
