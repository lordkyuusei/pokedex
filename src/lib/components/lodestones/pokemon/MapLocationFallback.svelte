<script lang="ts">
	import type { SimplifiedLocation } from '$lib/types/location';

	export let locationsPerGame: SimplifiedLocation[];
</script>

<table>
	<thead>
		<tr>
			<th></th>
			<th colspan="3">Lieu</th>
			<th colspan="14">Détails(%,méthode,niveau)</th>
		</tr>
	</thead>
	<tbody>
		{#each locationsPerGame as locationGroup}
			{#each locationGroup.locations as location, i}
				<tr>
					{#if i === 0}
						<td colspan="3" rowspan={locationGroup.locations.length}>
							{locationGroup.version}
						</td>
					{/if}
					<td colspan="3">
						{location.location}
					</td>
					<td colspan="12">
						{#each location.conditions as condition}
							{condition.chance}% {condition.method.name} lvl[{condition.min_level ===
							condition.max_level
								? condition.max_level
								: `${condition.min_level}/${condition.max_level}`}]
							{#if condition.condition_values.length}
								({condition.condition_values.map((val) => val.name)})
							{:else}
								(all-the-time)
							{/if}
							<br />
						{/each}
					</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>

<style>
	table thead {
		text-align: center;
	}
	table td {
		text-align-last: justify;
	}
</style>
