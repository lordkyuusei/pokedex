<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { generation } from '$lib/store/generation';
	import { lang } from '$lib/store/lang';

	$: abilitiesList = browser
		? fetch(`/api/abilities/gen/${$generation.id}`).then(async (x) => await x.json())
		: [];
</script>

<section id="abilities">
	{#await abilitiesList}
		<h1>wait</h1>
	{:then abilities}
		{#if abilities.length}
			<section id="abilities-table">
				<table>
					<thead>
						<th colspan="1">#</th>
						<th colspan="2">NOM</th>
						<th colspan="3">DESCRIPTION</th>
					</thead>
					<tbody>
						{#each abilities as ability (ability.id)}
							<tr on:click={() => goto(`/abilities/${ability.id}`)}>
								<td colspan="1">{ability.id}</td>
								<td class="name" colspan="2"
									>{ability.i18nName[$lang] ?? `(pas de traduction pour ${ability.name})`}</td
								>
								<td colspan="3">{ability.i18nFlavor ? ability.i18nFlavor[$lang] : '---'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>
		{:else}
			<h1>Pas de talents en génération {$generation.id}</h1>
		{/if}
	{/await}
</section>

<style>
	#abilities {
		height: 100%;
		overflow: auto;

		padding-inline: var(--normal-gap);
		padding-block: var(--small-gap);
	}

	[id$='-table'] {
		text-align: left;
		height: 100%;
		width: 100%;
		overflow-y: auto;
	}

	[id$='-table'] table tr td:first-child,
	[id$='-table'] table th:first-child {
		border-left: 0.5em solid transparent;
	}

	[id$='-table'] table tr:hover > td {
		font-weight: bolder;
		cursor: pointer;
		border-color: var(--primary-color);
		background-color: var(--background-accent);
	}

	[id$='-table'] table td {
		height: 3em;
	}

	[id$='-table'] table .name {
		font-weight: bolder;
		text-transform: uppercase;
	}
</style>
