<script lang="ts">
	import { lang } from '$lib/store/lang';
	import Switch from '$lib/components/fragments/Switch.svelte';
	import drawBookBackground from '$lib/functions/drawBackgroundFromTypes';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import type { FactoryPokemon } from '$lib/types/battle-factory';

	type Props = {
		open?: boolean;
		pokemon: FactoryPokemon;
		isLvl100Mode: boolean;
		roundSwapsBattles: number[];
        isSelectedMoveUser?: boolean;
		onHire?: (props) => void;
		onRental?: (props) => void;
		onBattle?: (props) => void;
		onMoveSelection?: (props) => void;
	};

	let { open = $bindable(false), pokemon, isLvl100Mode, isSelectedMoveUser, onHire, onBattle, onRental, onMoveSelection }: Props = $props();

	let name = $derived(pokemon.i18n[$lang] ?? pokemon.name);
	let stats = $derived(pokemon[isLvl100Mode ? 'lv100Stats' : 'lv50Stats']);
	let evs = $derived(pokemon['evs']);
</script>

<details
	class="pokemon-card"
    class:highlight={isSelectedMoveUser}
	bind:open
	data-title="{name}-{pokemon.variant} @{pokemon.item} ({pokemon.id})"
	style:background={drawBookBackground(pokemon.types)}
>
	<summary class="card-title">
		<img src={fetchPokemonSpriteURL(pokemon.dexId, 'icons', 'generation-viii')} alt={pokemon.name} />
		<span class="nature">
			{pokemon.nature}
		</span>
		<span class="ability">
			{pokemon.ability}
		</span>
		<div class="actions">
			{#if onHire}
				<Switch
					defaultState={pokemon.meta.isTeamed}
					event="toggle-{pokemon.id}-teamed"
					icon="pokedex"
					on:toggle={({ detail }) => onHire({ id: pokemon.id, checked: detail['toggle'] })}
				></Switch>
			{/if}
			{#if onBattle}
				<Switch
					defaultState={pokemon.meta.isOpponent}
					event="toggle-{pokemon.id}-opponent"
					icon="training"
					on:toggle={({ detail }) => onBattle({ id: pokemon.id, checked: detail['toggle'] })}
				></Switch>
			{/if}
			{#if onRental}
				<Switch
					defaultState={false}
					event="toggle-{pokemon.id}-rental"
					icon="training"
					on:toggle={({ detail }) => onRental({ id: pokemon.id, checked: detail['toggle'] })}
				></Switch>
			{/if}
		</div>
	</summary>
	<ul class="card-moves">
		{#each pokemon.moves as move, i}
			{@const title = `Move N°${i + 1}${move.style !== -1 ? ` (${move.style})` : ''}`}
			<li style:background={drawBookBackground([move.moveType])} data-title={title}>
				{#if onMoveSelection}
					<button onclick={() => onMoveSelection({ move, id: pokemon.id })}>
						{move.i18n[$lang]}
					</button>
				{:else}
					{move.i18n[$lang]}
				{/if}
			</li>
		{/each}
	</ul>
	<ul class="card-stats">
		{#if pokemon.meta.isTeamed || pokemon.meta.isOpponent}
			<li class:up={evs[0] >= 126} data-title="P.V.">{stats[0]} <sup>{evs[0]}</sup></li>
			<li class:up={evs[1] >= 126} data-title="Atk">{stats[1]} <sup>{evs[1]}</sup></li>
			<li class:up={evs[2] >= 126} data-title="Def">{stats[2]} <sup>{evs[2]}</sup></li>
			<li class:up={evs[3] >= 126} data-title="SpA">{stats[3]} <sup>{evs[3]}</sup></li>
			<li class:up={evs[4] >= 126} data-title="SpD">{stats[4]} <sup>{evs[4]}</sup></li>
			<li class:up={evs[5] >= 126} data-title="SpE">{stats[5]} <sup>{evs[5]}</sup></li>
		{:else}
			<li class:up={evs[0] >= 126} data-title="P.V. ({evs[0]})">
				{stats[0] - 31}-{stats[0]}
			</li>
			<li class:up={evs[1] >= 126} data-title="Atk ({evs[1]})">
				{stats[1] - 31}-{stats[1]}
			</li>
			<li class:up={evs[2] >= 126} data-title="Def ({evs[2]})">
				{stats[2] - 31}-{stats[2]}
			</li>
			<li class:up={evs[3] >= 126} data-title="SpA ({evs[3]})">
				{stats[3] - 31}-{stats[3]}
			</li>
			<li class:up={evs[4] >= 126} data-title="SpD ({evs[4]})">
				{stats[4] - 31}-{stats[4]}
			</li>
			<li class:up={evs[5] >= 126} data-title="SpE ({evs[5]})">
				{stats[5] - 31}-{stats[5]}
			</li>
		{/if}
	</ul>
</details>

<style>
	details.pokemon-card {
		margin-top: var(--small-gap);
		box-shadow: var(--box-shadow);
		border: 1px solid var(--text-color);

		&[open] {
			padding-bottom: var(--small-gap);
		}

        &.highlight {
            border-color: var(--accent-color);
            
            &::before {
                color: var(--accent-color);
            }
        }

        & > summary {
			display: grid;
			grid-template: 'picture nature ability actions' 100% / auto 1fr 1fr 1fr;
			align-items: center;
			gap: var(--smaller-gap);
			padding: var(--smaller-gap) var(--small-gap);
			background-color: var(--background-blur-color);
			transition: background-color var(--transition-duration) var(--transition-function);

			&:hover {
				background-color: var(--background-blur-second-color);
			}

			& > span {
				&.nature {
					grid-area: nature;
				}

				&.ability {
					grid-area: ability;
				}

				&.item {
					grid-area: item;
				}
			}

			& > div.actions {
				grid-area: actions;
				display: flex;
				justify-content: end;
				gap: var(--small-gap);
				align-items: center;
			}

			&:hover {
				cursor: pointer;
			}
		}

		& > ul {
			display: flex;
			gap: var(--small-gap);
			padding-inline: var(--small-gap);
			padding-top: var(--small-gap);

			& > li {
				width: 100%;
				display: flex;
				justify-content: center;
				text-align: center;
				border: 1px solid currentColor;
                text-wrap: nowrap;
				background-color: var(--background-color);
                padding: var(--small-gap);
                
				& > button {
                    all: unset;
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
				}

				&::before {
					text-wrap: nowrap;
				}

				&.up {
					font-weight: 600;
					color: var(--second-color);
				}

				& > sup {
					font-size: 0.63em;
					padding-left: var(--smallest-gap);
				}
			}
		}
	}

	@container pokemon-preview (width < 50cqi) {
		details.pokemon-card summary {
			background-color: var(--background-second-color);
		}

		details.pokemon-card ul li {
			font-size: small;
			padding: var(--small-gap) var(--smaller-gap);
			background-color: var(--background-second-color);
		}
	}

	@media (width < 640px) {
		details.pokemon-card > ul.card-moves {
			display: grid;
			grid-template: 1fr 1fr / 1fr 1fr;
		}

		details.pokemon-card > ul.card-stats {
			display: grid;
			grid-template: 1fr 1fr 1fr / 1fr 1fr;
		}
	}
</style>
