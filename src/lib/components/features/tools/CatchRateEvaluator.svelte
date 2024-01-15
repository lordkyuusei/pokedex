<script lang="ts">
	import { balls } from '$lib/constants/pokeballs';
	import { ailments } from '$lib/constants/ailments';
	import { HPFormula } from '$lib/functions/statFormula';
	import type { Generation } from '$lib/types/generation';
	import type { Lightkemon } from '$lib/types/lightkemon';
	import type { Pokemon } from '$lib/types/pokeapi/pokemon';
	import { ITEMS_SPRITE_URL } from '$lib/constants/api.json';
	import type { PokemonSpecie } from '$lib/types/pokeapi/specie';
	import { computeCatchRate, simulateCatchGen1 } from '$lib/functions/computeCatchRates';

	export let generation: Generation;

	let pokemonId: number = 1;
	let ballUsed: number = 1;
	let ailmentInflicted: number;
	let level: number = 1;
	let hpPercent: number = 1;

	let isCaught: boolean = false;
	let shakes: number = 0;
	let catchChances: string = '0';

	$: console.log(ballUsed);
	$: genBalls = balls.filter((ball) => ball.appearedInGen <= generation.id);
	$: pokemonList = fetch(`/api/pokemon?from=1&to=${generation.boundaries.to}`).then(
		async (response) => (await response.json()) as Promise<Lightkemon[]>
	);

	$: pokemonInfo = fetch(`/api/pokemon/specie?name=${pokemonId}`).then(
		async (response) =>
			(await response.json()) as Promise<{ pokemon: Pokemon; specie: PokemonSpecie }>
	);

	const simulateCatchRate = (info: { pokemon: Pokemon; specie: PokemonSpecie }) => {
		const { pokemon, specie } = info;
		const pokemonHp = HPFormula(pokemon.stats[0].base_stat, level, 0, 31, true);
		const conditions = {
			catchRate: specie.capture_rate,
			ballId: ballUsed,
			ailmentId: ailmentInflicted,
			isCaught: specie.capture_rate,
			maxHp: pokemonHp,
			curHp: pokemonHp * (hpPercent / 100)
		};

		const chances = computeCatchRate(generation.id, conditions);
		const result = simulateCatchGen1(conditions);

		catchChances = `${chances}`;
		isCaught = result.catch;
		shakes = result.shakes;
	};
</script>

<div>
	<header id="catchrate-options">
		<div class="options-select">
			<label for="options-pokemon">Select a Pokemon</label>
			{#await pokemonList}
				<select id="options-pokemon">
					<option>Loading...</option>
				</select>
			{:then list}
				<select id="options-pokemon" bind:value={pokemonId}>
					{#each list as pokemon}
						<option value={pokemon.id}>{pokemon.id} - {pokemon.name}</option>
					{/each}
				</select>
			{/await}
		</div>
		<div class="options-ulist">
			<label for="options-ball">Select a Pokéball</label>
			<ul id="options-ball">
				{#each genBalls as ball}
					<li class="ball-info">
						<input
							type="radio"
							name="chosenBall"
							id={ball.name}
							bind:group={ballUsed}
							value={ball.id}
						/>
						<label for={ball.name} class:chosen={ball.id === ballUsed}>
							<img alt={ball.name} src={`${ITEMS_SPRITE_URL}/${ball.name}.png`} />
							{ball.name}
						</label>
					</li>
				{/each}
			</ul>
		</div>
		<div class="options-input">
			<label for="options-ailment">Select an ailment</label>
			<select id="options-ailment" bind:value={ailmentInflicted}>
				{#each ailments as ailment}
					<option value={ailment.id}>{ailment.name}</option>
				{/each}
			</select>

			<label for="currentLevel">Level: {level}</label>
			<input id="currentLevel" type="number" min="0" max="100" bind:value={level} />

			<label for="currentHp">HP%: {hpPercent}</label>
			<input id="currentHp" type="number" min="0" max="100" bind:value={hpPercent} />

			<label for="currentHpVisual">HP Bar approx.</label>
			<meter
				id="currentHpVisual"
				min="0"
				max="100"
				optimum="100"
				low="20"
				high="50"
				value={hpPercent}
			></meter>
		</div>
	</header>
	<output>
		{#await pokemonInfo then info}
			{#if info}
				<button on:click={() => simulateCatchRate(info)}>simulate catch rate</button>
				<p>
					Simulation result: {isCaught ? '[caught]' : '[broke free]'}, Nb. shakes: {shakes}
				</p>
				<p>
					Probabilities: {catchChances}%
				</p>
			{/if}
		{/await}
	</output>
</div>

<style>
	div {
		& > header#catchrate-options {
			display: grid;
			grid-template: 1fr 1fr 1fr / 100%;
			gap: var(--small-gap);

			& > div {
				display: grid;
				column-gap: var(--small-gap);
				align-items: center;

				padding-bottom: var(--small-gap);
				border-bottom: 1px solid var(--background-color-___);
			}

			& > div.options-select {
				grid-template: 1fr 1fr / min-content;

				& > select {
					padding: var(--smallest-gap);
					border-radius: var(--border-r-50);
				}
			}

			& > div.options-ulist {
				grid-template-rows: 0.5fr 1fr;
				grid-auto-flow: column;

				& > ul#options-ball {
					display: grid;
					grid-auto-flow: column;
					grid-auto-columns: auto;
					gap: var(--smallest-gap);
					align-items: center;

					list-style: none;

					overflow-x: auto;
					& > li.ball-info {
						&:hover {
							cursor: pointer;
							background-color: var(--background-color-___);
						}

						& > label {
							display: grid;
							grid-template-columns: auto 1fr;
							align-items: center;
							padding: var(--smallest-gap) var(--small-gap);
							border-radius: var(--border-r-50);

							&:hover {
								cursor: pointer;
							}

							&.chosen {
								background-color: var(--background-color-____);
							}
						}
						& > input {
							display: none;
						}

						&:has(input:checked) {
							background: var(--background-color-___);
						}
					}
				}
			}

			& > div.options-input {
				grid-template-rows: 1fr 1fr;
				grid-auto-columns: min-content;

				& > label {
					grid-row: 1;
				}

				& > :is(input, select) {
					padding: var(--smallest-gap);
					border-radius: var(--border-r-50);
					grid-row: 2;
				}

				& > meter {
					height: 1rem;
					width: 8rem;
				}

				& > meter::-webkit-meter-optimum-value {
					background-color: #48a058;
				}

				& > meter::-webkit-meter-suboptimum-value {
					background-color: #d0a000;
				}

				& > meter::-webkit-meter-even-less-good-value {
					background: #d05030;
				}
			}
		}

		& > output {
			display: grid;
			grid-auto-flow: row;
		}
	}
</style>
