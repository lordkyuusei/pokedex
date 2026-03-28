<script lang="ts">
	import { swapsToUpperRoundPokemonThresholdsMap, roundToIVsSpreadMap } from '$lib/constants/battle-factory';
</script>

<div>
	<h1>IVs Table Lookup</h1>
	<table>
		<thead>
			<tr>
				<th>Round</th>
				<th>Player's IV</th>
				<th>7th Trainer IV</th>
				<th>Noland's IV</th>
			</tr>
		</thead>
		<tbody>
			{#each roundToIVsSpreadMap as { round, ivs }, i}
				<tr>
					<td>{`${round}${(i + 1) === roundToIVsSpreadMap.length ? "+" : ""}`}</td>
					<td>{ivs[0]}</td>
					<td>{ivs[1]}</td>
					<td>{ivs[2]}</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<h1>Battle Styles</h1>
	<table>
		<thead>
			<tr>
				<th>Category</th>
				<th>Treshold</th>
				<th colspan="4">Sentence</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>(None)</td>
				<td>3</td>
				<td colspan="4">"appears to be free-spirited and unrestrained"</td>
			</tr>
			<tr>
				<td>1</td>
				<td>3</td>
				<td colspan="4">"appears to be one based on total preparation"</td>
			</tr>
			<tr>
				<td>2</td>
				<td>3</td>
				<td colspan="4">"appears to be slow and steady"</td>
			</tr>
			<tr>
				<td>3</td>
				<td>4</td>
				<td colspan="4">"appears to be one of endurance"</td>
			</tr>
			<tr>
				<td>4</td>
				<td>4</td>
				<td colspan="4">"appears to be high risk, high return"</td>
			</tr>
			<tr>
				<td>5</td>
				<td>4</td>
				<td colspan="4">"appears to be weakening the foe to start"</td>
			</tr>
			<tr>
				<td>6</td>
				<td>4</td>
				<td colspan="4">"appears to be impossible to predict"</td>
			</tr>
			<tr>
				<td>7</td>
				<td>4</td>
				<td colspan="4">"appears to depend on the battle's flow"</td>
			</tr>
			<tr>
				<td>(3+)</td>
				<td>?</td>
				<td colspan="4">"appears to be flexibly adaptable to the situation"</td>
			</tr>
		</tbody>
	</table>

	<h1>Swaps benefits</h1>
	<table>
		<thead>
			<tr>
				<th>Nb. Swaps</th>
				<th>Nb. Round + 1 Pokémon</th>
			</tr>
		</thead>
		<tbody>
			{#each swapsToUpperRoundPokemonThresholdsMap as { range, amount }}
				<tr>
					<td>
						{range[0]} to {range[1]}
					</td>
					<td>
						{amount}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	div {
		display: grid;
		grid-template: auto 1fr / 1fr 1.5fr 1fr;
		gap: var(--smaller-gap) var(--small-gap);
		background: var(--background-second-color);
		padding: 0 var(--small-gap) var(--small-gap);

		& > h1 {
			grid-row: 1;
		}

		& > table {
			grid-row: 2;
			border: 1px solid currentColor;
		}
	}
</style>
