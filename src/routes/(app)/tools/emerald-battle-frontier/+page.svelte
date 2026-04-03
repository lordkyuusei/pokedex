<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	import Switch from '$lib/components/fragments/Switch.svelte';
	import PokemonCard from '$lib/components/lodestones/pokemon/PokemonCard.svelte';
	import type { FactoryPokemon, FactoryPokemonRaw } from '$lib/types/battle-factory';

	import BattleFrontierCoverage from '$lib/components/lodestones/BattleFrontierCoverage.svelte';
	import BattleFrontierDamageCalculator from '$lib/components/lodestones/BattleFrontierDamageCalculator.svelte';
	import BattleFrontierHelpScreen from '$lib/components/lodestones/BattleFrontierHelpScreen.svelte';
	import { loadBattleFrontierRoster } from '$lib/functions/excelSheetParsing';
	import { fetchPokemonSpriteURL } from '$lib/functions/getPokemonSpritesURL';
	import type { LightMoveDetails } from '$lib/types/lightmove';
	import {
		assignMovesToPokemon,
		assignStatsToPokemon,
		onRoundChange,
		onSearchChange,
		onTeamChange,
		replacePokemonFairyType
	} from './functions.svelte';

	let { data } = $props();

	let searchInput: string = $state('');
	let roundSwapsBattles: [number, number, number] = $state([1, 1, 1]);

	let showHelp: boolean = $state(false);
	let localData: boolean = $state(false);
	let isLvl100Mode: boolean = $state(true);
	let showSearchResult: boolean = $state(false);
	let showCoverageDialog: boolean = $state(false);

	let factoryPokemonList: FactoryPokemon[] = $state([]);
	let selectedMove: (LightMoveDetails & { style: number }) | null = $state(null);

	let rentalPokemon = $derived(factoryPokemonList.filter((x) => x.meta.isRental));
	let teamedPokemon = $derived(factoryPokemonList.filter((x) => x.meta.isTeamed));
	let opponentPokemon = $derived(factoryPokemonList.filter((x) => x.meta.isOpponent));
	let selectedTeamedPokemon = $derived(teamedPokemon.find((x) => x.meta.isTeamSelected));
	let selectedOpponentPokemon = $derived(opponentPokemon.find((x) => x.meta.isOpponentSelected));
	let availablePokemon = $derived(onRoundChange(factoryPokemonList, isLvl100Mode, roundSwapsBattles, rentalPokemon.length, isRentalMode));

	let isRentalMode: boolean = $derived(teamedPokemon.length !== 3);
	let teamBuildingPokemonPreview: FactoryPokemon | null = $state(null);
	let isTeamBuildingMode: boolean = $derived(isRentalMode && rentalPokemon.length === 6);

	let damageCalculatorUser = $derived(selectedTeamedPokemon);
	let damageCalculatorTarget = $derived(selectedOpponentPokemon);
	let factoryCoverage = $derived(onTeamChange(availablePokemon, teamedPokemon));
	let matchingResult = $derived(onSearchChange(availablePokemon, searchInput, teamedPokemon, opponentPokemon));

	const resetOpponentPokemon = () => {
		opponentPokemon.forEach((pokemon) => {
			const factoryPokemonIndex = factoryPokemonList.findIndex((x) => x.id === pokemon.id);
			factoryPokemonList = factoryPokemonList.with(factoryPokemonIndex, {
				...factoryPokemonList[factoryPokemonIndex],
				meta: { ...factoryPokemonList[factoryPokemonIndex].meta, isOpponent: false, isOpponentSelected: false }
			});
		});
	};

	const setSelectedPokemon = (id: number | null, selectionMethod: 'isTeamSelected' | 'isOpponentSelected') => {
		const selectedPokemonIndex = factoryPokemonList.findIndex((x) => x.meta[selectionMethod] === true);
		if (selectedPokemonIndex !== -1) {
			const pokemon = factoryPokemonList[selectedPokemonIndex];
			factoryPokemonList = factoryPokemonList.with(selectedPokemonIndex, {
				...pokemon,
				meta: { ...pokemon.meta, [selectionMethod]: false }
			});
		}

		const nextSelectedPokemonIndex = factoryPokemonList.findIndex((x) => x.id === id);
		if (nextSelectedPokemonIndex === -1) return;

		const pokemon = factoryPokemonList[nextSelectedPokemonIndex];
		factoryPokemonList = factoryPokemonList.with(nextSelectedPokemonIndex, {
			...pokemon,
			meta: { ...pokemon.meta, [selectionMethod]: true }
		});
	};

	const setSelectedTeamedPokemon = (id: number | null) => setSelectedPokemon(id, 'isTeamSelected');

	const setSelectedOpponentPokemon = (id: number | null) => setSelectedPokemon(id, 'isOpponentSelected');

	const doNotSwapPokemon = () => {
		resetOpponentPokemon();
		setSelectedOpponentPokemon(null);
		roundSwapsBattles[2] += 1;
	};

	const swapPokemon = () => {
		if (!selectedOpponentPokemon || !selectedTeamedPokemon) return;

		const selectedTeamedIndex = factoryPokemonList.findIndex((x) => x.id === selectedTeamedPokemon.id);
		const selectedOpponentIndex = factoryPokemonList.findIndex((x) => x.id === selectedOpponentPokemon.id);
		if (selectedTeamedIndex === -1 || selectedOpponentIndex === -1) return;

		factoryPokemonList = factoryPokemonList.with(selectedTeamedIndex, {
			...factoryPokemonList[selectedTeamedIndex],
			meta: {
				...factoryPokemonList[selectedTeamedIndex].meta,
				isTeamed: false
			}
		});

		factoryPokemonList = factoryPokemonList.with(selectedOpponentIndex, {
			...factoryPokemonList[selectedOpponentIndex],
			meta: {
				...factoryPokemonList[selectedOpponentIndex].meta,
				isTeamed: true
			}
		});

		resetOpponentPokemon();
		setSelectedTeamedPokemon(teamedPokemon[0].id);
		setSelectedOpponentPokemon(null);
		roundSwapsBattles[2] += 1;
	};

	const toggleRentalPokemon = (event: { id: number; checked: boolean }): void => {
		const { id, checked } = event;

		const newRentalPokemonIndex = factoryPokemonList.findIndex((x) => x.id === id);
		if (newRentalPokemonIndex === -1) return;

		if (checked === false) {
			const pokemon = factoryPokemonList[newRentalPokemonIndex];
			factoryPokemonList = factoryPokemonList.with(newRentalPokemonIndex, {
				...pokemon,
				meta: { ...pokemon.meta, isRental: false }
			});
		} else {
			const teamLength = factoryPokemonList.filter((x) => x.meta.isRental).length;
			const pokemonWithStats = assignStatsToPokemon(factoryPokemonList[newRentalPokemonIndex], roundSwapsBattles[0], roundSwapsBattles[1], {
				isRental: true,
				teamLength
			});

			factoryPokemonList = factoryPokemonList.with(newRentalPokemonIndex, {
				...pokemonWithStats,
				meta: { ...pokemonWithStats.meta, isRental: true }
			});
		}
	};

	const toggleRentalToTeamedPokemon = (event: { id: number; checked: boolean }): void => {
		const { id, checked } = event;

		const newRentalPokemonIndex = factoryPokemonList.findIndex((x) => x.id === id);
		if (newRentalPokemonIndex === -1) return;

		const pokemon = factoryPokemonList[newRentalPokemonIndex];
		factoryPokemonList = factoryPokemonList.with(newRentalPokemonIndex, {
			...pokemon,
			meta: { ...pokemon.meta, isTeamed: checked }
		});

		const currentRental = factoryPokemonList.filter((x) => x.meta.isRental);
		const teamLength = factoryPokemonList.filter((x) => x.meta.isTeamed).length;

		if (checked === true && teamLength === 3) {
			currentRental.forEach((member) => {
				const index = factoryPokemonList.findIndex((x) => x.id === member.id);
				factoryPokemonList = factoryPokemonList.with(index, {
					...factoryPokemonList[index],
					meta: { ...factoryPokemonList[index].meta, isRental: false }
				});
			});
			isRentalMode = false;
		}
	};

	const toggleTeamedPokemon = (event: { id: number; checked: boolean }) => {
		const { id, checked } = event;

		const newTeamedPokemonIndex = factoryPokemonList.findIndex((x) => x.id === id);
		if (newTeamedPokemonIndex === -1) return;

		const pokemon = factoryPokemonList[newTeamedPokemonIndex];
		factoryPokemonList = factoryPokemonList.with(newTeamedPokemonIndex, {
			...pokemon,
			meta: { ...pokemon.meta, isTeamed: checked }
		});
	};

	const toggleOpponentPokemon = (event: { id: number; checked: boolean }) => {
		const { id, checked } = event;

		const newOpponentPokemonIndex = factoryPokemonList.findIndex((x) => x.id === id);
		if (newOpponentPokemonIndex === -1) return;

		if (checked === false) {
			const pokemon = factoryPokemonList[newOpponentPokemonIndex];
			factoryPokemonList = factoryPokemonList.with(newOpponentPokemonIndex, {
				...pokemon,
				meta: { ...pokemon.meta, isOpponent: checked }
			});
		} else {
			const pokemon = assignStatsToPokemon(factoryPokemonList[newOpponentPokemonIndex], roundSwapsBattles[0], roundSwapsBattles[1], {
				isRental: false,
				isOpponent: true,
				isSeventhTrainer: roundSwapsBattles[2] === 7
			});

			factoryPokemonList = factoryPokemonList.with(newOpponentPokemonIndex, {
				...pokemon,
				meta: { ...pokemon.meta, isOpponent: checked }
			});

			setSelectedOpponentPokemon(id);
		}
	};

	const updateSearch = (event: FactoryPokemon) => {
		searchInput = event.name;
		roundSwapsBattles[0] = Math.min(event.variant, 7);
		showCoverageDialog = false;
	};

	const setSelectedMove = (e: { move: LightMoveDetails & { style: number }; id: number }) => {
		if (!selectedOpponentPokemon || !selectedTeamedPokemon) return;

		const { id, move } = e;

		selectedMove = move;
		if (damageCalculatorUser?.id === id) return;

		damageCalculatorUser = factoryPokemonList.find((t) => t.id === id);
        damageCalculatorTarget = selectedTeamedPokemon.id === damageCalculatorUser?.id ? selectedOpponentPokemon : selectedTeamedPokemon 
	};

	const handleSearchSubmit = (event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (event.key !== 'Enter') return;

		const firstMatch = matchingResult[0];
		if (!firstMatch) return;

		if (isRentalMode) toggleRentalPokemon({ id: firstMatch.id, checked: true });
		else toggleOpponentPokemon({ id: firstMatch.id, checked: true });

		matchingResult = [];
		searchInput = '';
		showSearchResult = false;
	};

	const fillRentalTestData = () => {
		const teamedPokemonIds = [373, 445, 502, 392, 485, 532];

		factoryPokemonList = factoryPokemonList.map((pokemon) => {
			if (teamedPokemonIds.includes(pokemon.id)) {
				const teamLength = factoryPokemonList.filter((x) => x.meta.isTeamed).length;
				return {
					...assignStatsToPokemon(pokemon, 1, 1, { teamLength }),
					meta: { ...pokemon.meta, isRental: true }
				};
			}

			return pokemon;
		});
	};

	const fillTestData = () => {
		const teamedPokemonIds = [373, 445, 502];
		const opponentPokemonIds = [392, 485, 532];

		factoryPokemonList = factoryPokemonList.map((pokemon) => {
			if (teamedPokemonIds.includes(pokemon.id)) {
				const teamLength = factoryPokemonList.filter((x) => x.meta.isTeamed).length;
				return {
					...assignStatsToPokemon(pokemon, 1, 1, { teamLength }),
					meta: { ...pokemon.meta, isTeamed: true, isTeamSelected: teamLength === 0 }
				};
			}

			if (opponentPokemonIds.includes(pokemon.id)) {
				const teamLength = factoryPokemonList.filter((x) => x.meta.isOpponent).length;
				return {
					...assignStatsToPokemon(pokemon, 1, 1, { isOpponent: true, isSeventhTrainer: false }),
					meta: { ...pokemon.meta, isOpponent: true, isOpponentSelected: teamLength === 0 }
				};
			}

			return pokemon;
		});

		setSelectedTeamedPokemon(teamedPokemonIds[0]);
		setSelectedOpponentPokemon(opponentPokemonIds[0]);

		isRentalMode = false;
	};

	const clearState = () => {
		factoryPokemonList = factoryPokemonList.map((fp) => ({
			...fp,
			meta: { isOpponent: false, isOpponentSelected: false, isRental: false, isTeamed: false, isTeamSelected: false }
		}));
	};

	onMount(async () => {
		if (data.battleFrontierData) {
			const { battleFrontierList } = JSON.parse(data.battleFrontierData);

			const { pokemon, moves }: { pokemon: FactoryPokemonRaw[]; moves: LightMoveDetails[] } = JSON.parse(battleFrontierList);

			if (pokemon.length) {
				localData = true;
				factoryPokemonList = assignMovesToPokemon(replacePokemonFairyType(pokemon), moves);
			} else {
				localData = false;
				const id =
					'ACu2nxsvGst6zpDJRhbYfKrqe2Tu6KLrfR8N6bMFlVPqL8Z9eAesKZOFYL1ltN3xi_j7BlJijxxYX3nGrLvv7RrEA7W_kdMKnuXohsKzPjzqJsMC62JIjLstUK6kHBpxrCShOzEgB5o-0IfhAUZNp9OCXGbAjd4rZfWG27Vgg1bhLSpjM4bu1mtDzLTtoV6QorUF4JwS0afXuQp9Fust42BpooN0yVb0_TxMMslYprQFj4lbXduwAKmxdf2yUtXncm9V1eR1cUmA2MFqVwKJMicWcfykRnUsU5JAnRqEfGNJInVJTdn7q5C4wSEYf0lV_O1btiCV-SGbrrYj9QlZY1I-NiwsKea3RnLP1CCDu3BDmsDfUf72fyr9Clh1h4BpPxU';

				const battleFrontierResources = await fetch(`/api/tools/emerald-battle-frontier?id=${id}`);
				const { battleFrontierSheet, pokemonReferences } = await battleFrontierResources.json();

				const references = JSON.parse(pokemonReferences);
				const rawFactoryList = loadBattleFrontierRoster(battleFrontierSheet, references);
				factoryPokemonList = assignMovesToPokemon(rawFactoryList, moves);
			}
		}
	});

	$inspect(isRentalMode, isTeamBuildingMode, rentalPokemon.length);
</script>

<section id="tool-battle-frontier">
	<header data-title={isRentalMode ? 'Rental Mode: select the 6-proposed Pokémon, then choose your 3 Pokémon Team.' : 'Battle Mode'}>
		<fieldset>
			<legend>Search a Pokémon, move, battle style...</legend>
			<input
				type="search"
				bind:value={searchInput}
				oninput={() => (showSearchResult = searchInput.length > 2)}
				disabled={factoryPokemonList.length === 0}
				placeholder="syntax: name @held-item -move-name $type #battle-style-number"
				onkeypress={handleSearchSubmit}
			/>
		</fieldset>
		<fieldset>
			<legend>Nb. Rounds & Swaps</legend>
			<select id="currentRound" bind:value={roundSwapsBattles[0]}>
				{#each [...new Array(7)] as _, index}
					<option value={index + 1}>{index + 1}{index === 6 ? '+' : ''}</option>
				{/each}
			</select>
			<select id="currentSwaps" bind:value={roundSwapsBattles[1]}>
				{#each [...new Array(50)] as _, index}
					<option value={index + 1}>{index + 1}{index === 49 ? '+' : ''}</option>
				{/each}
			</select>
		</fieldset>
		<fieldset>
			<legend>Lvl. 50 / 100</legend>
			<Switch
				customName
				event="isLvl100Mode"
				icon="pokedex"
				defaultState={isLvl100Mode}
				on:isLvl100Mode={(e) => (isLvl100Mode = e.detail.isLvl100Mode)}
			/>
		</fieldset>
		<fieldset>
			<legend>Show Efficiency / Help</legend>
			<Switch
				customName
				event="showEfficiency"
				icon="pokedex"
				defaultState={showCoverageDialog}
				on:showEfficiency={(e) => {
					showCoverageDialog = e.detail.showEfficiency;
					showHelp = false;
				}}
			></Switch>
			<Switch
				customName
				event="showHelp"
				icon="pokedex"
				defaultState={showHelp}
				on:showHelp={(e) => {
					showHelp = e.detail.showHelp;
					showCoverageDialog = false;
				}}
			></Switch>
		</fieldset>
		{#if dev}
			<fieldset>
				<legend>Fill Test / Clear state</legend>
				<button id="fill-sheet" onclick={fillTestData}>🎴</button>
				<button id="rental-sheet" onclick={fillRentalTestData}>🚂</button>
				<button id="clear-sheet" onclick={clearState}>🧹</button>
			</fieldset>
		{/if}
	</header>
	<hr class="mb-s" />
	<output class:show-dialog={showSearchResult || showCoverageDialog || showHelp}>
		{#if showSearchResult}
			<ul class="search-result">
				{#if matchingResult.length === 0 && searchInput.length > 3}
					<li>Pas de résultat.</li>
				{/if}
				{#each matchingResult as pokemon}
					<li class="result-element">
						<PokemonCard
							{pokemon}
							{isLvl100Mode}
							{roundSwapsBattles}
							onHire={!isRentalMode ? toggleTeamedPokemon : undefined}
							onRental={isRentalMode ? toggleRentalPokemon : undefined}
							onBattle={!isRentalMode ? toggleOpponentPokemon : undefined}
							onMoveSelection={!isRentalMode ? setSelectedMove : undefined}
						></PokemonCard>
					</li>
				{/each}
			</ul>
		{:else if showCoverageDialog}
			<BattleFrontierCoverage {factoryCoverage} {teamedPokemon} {updateSearch}></BattleFrontierCoverage>
		{:else if showHelp}
			<BattleFrontierHelpScreen></BattleFrontierHelpScreen>
		{/if}
		{#if isRentalMode}
			<h1>1. Sélection des Pokémon</h1>
			<ul class="rental-reminder">
				{#each Array.from({ length: 6 }) as _, slot}
					{@const pokemon = rentalPokemon[slot]}
					{#if pokemon}
						<li class="reminder-element" class:hired={teamedPokemon.includes(pokemon)}>
							<button class="wrap" onclick={() => (teamBuildingPokemonPreview = pokemon)}>
								<img src={fetchPokemonSpriteURL(pokemon.dexId)} alt={pokemon.name} />
								<span>{pokemon.name}</span>
							</button>
						</li>
					{:else}
						<li class="reminder-element">
							<button class="wrap">
								<img src={fetchPokemonSpriteURL(0)} alt="" />
								<span> Pokémon n°{slot + 1}</span>
							</button>
						</li>
					{/if}
				{/each}
			</ul>
			{#if rentalPokemon.length === 0}
				<p class="mb-s">Utilisez la barre de recherche pour inscrire les 6 Pokémon de la sélection.</p>
			{:else}
				<hr class="mb-s" />
			{/if}
			{#if isTeamBuildingMode && teamBuildingPokemonPreview}
				<PokemonCard
					pokemon={teamBuildingPokemonPreview}
					{isLvl100Mode}
					{roundSwapsBattles}
					open={true}
					onHire={isRentalMode ? toggleTeamedPokemon : undefined}
				></PokemonCard>
			{/if}
		{:else}
			<battlefield>
				{@render team(teamedPokemon, setSelectedTeamedPokemon)}
				{@render preview(selectedTeamedPokemon)}
				<ul class="actions">
                    <button class="round" onclick={swapPokemon}>⬅️</button>
                    <button class="round" onclick={doNotSwapPokemon}>✖️</button>
                </ul>
				{@render preview(selectedOpponentPokemon)}
				{@render team(opponentPokemon, setSelectedOpponentPokemon)}
				{#if damageCalculatorUser && damageCalculatorTarget && selectedMove}
					<output class="damage-calculator pb-s pi-s">
						<BattleFrontierDamageCalculator
							user={damageCalculatorUser}
							target={damageCalculatorTarget}
							move={selectedMove}
							isLvL100Mode={isLvl100Mode}
						></BattleFrontierDamageCalculator>
					</output>
				{/if}
			</battlefield>
		{/if}
	</output>

	{#snippet team(team: FactoryPokemon[], selectionCallback: (id: number | null) => void)}
		<ul class="factory-team" data-title="Equipe">
			{#each Array.from({ length: 3 }) as _, slot}
				{@const pokemon = team[slot]}
				<li class="team-element">
					<button class="wrap" onclick={() => selectionCallback(pokemon.id)}>
						<img src={fetchPokemonSpriteURL(pokemon.dexId)} alt={pokemon.name} />
					</button>
				</li>
			{/each}
		</ul>
	{/snippet}

	{#snippet preview(pokemon?: FactoryPokemon)}
		<pokemon-preview data-title="Aperçu du pokémon">
			{#if pokemon}
				<PokemonCard open {pokemon} {isLvl100Mode} {roundSwapsBattles} onMoveSelection={setSelectedMove}></PokemonCard>
			{/if}
		</pokemon-preview>
	{/snippet}
</section>

<style>
	section#tool-battle-frontier {
		height: 100%;
		width: 100%;
		padding: var(--small-gap);

		display: grid;
		grid-template-rows: auto auto 1fr;

		position: relative;

		& > header {
			position: sticky;
			top: 0;

			display: grid;
			grid-auto-flow: column;
			grid-template-columns: 1fr repeat(4, auto);
			align-items: stretch;
			gap: var(--small-gap);

			padding: var(--small-gap);
			background: var(--background-second-color);
			border-radius: var(--smaller-gap) var(--smaller-gap) 0 0;
			z-index: 2;

			& > fieldset {
				& > :not(legend) {
					width: 100%;
				}

				& > input[type='search'] {
					border: none;
				}
			}

			@media (max-width: 640px) {
				grid-template-rows: 1fr auto;

				& > fieldset > input {
					height: calc(100% - var(--smaller-gap));
					background-color: var(--background-second-color);
					grid-area: 1 / 1 / 1 / -1;
				}

				& > :not(input) {
					grid-row: 2;
				}
			}
		}

		& > output {
			padding: var(--small-gap);
			background: var(--background-second-color);
			border-radius: 0 0 var(--smaller-gap) var(--smaller-gap);
			position: relative;

			&.show-dialog > ul.search-result {
				position: absolute;
				inset: 0;
				z-index: 3;
				box-shadow: var(--box-shadow);
				background-color: var(--background-color);
			}

			& > ul {
				&.rental-reminder {
					display: grid;
					grid-template-columns: repeat(6, 1fr);
					gap: var(--small-gap);

					& > li.reminder-element {
						display: grid;
						grid-template-columns: auto 1fr;
						align-items: center;
						padding: var(--smaller-gap);
						border-radius: var(--large-gap);
						background-color: var(--background-color);

						&.hired {
							background-color: var(--second-color);

							& span {
								color: var(--background-color);
							}
						}

						& img {
							background-color: var(--background-second-color);
							border-radius: 50%;
							height: var(--large-gap);
						}

						& span {
							text-align: center;
						}
					}
				}
			}

			battlefield {
				display: grid;
				grid-template:
                    'left-team left-preview actions right-preview right-team' 1fr
                    'dmg-calc dmg-calc dmg-calc dmg-calc dmg-calc' auto / auto 1fr 1px 1fr auto;
				gap: var(--small-gap);

				& > ul.factory-team,
				& > pokemon-preview {
					padding: var(--small-gap);
					border-radius: var(--border-r-50);
					background-color: var(--background-color);
				}

				& > ul.factory-team {
                    &:first-of-type {
                        grid-area: left-team;
                    }

                    &:last-of-type {
                        grid-area: right-team
                    }

                    display: grid;
					grid-auto-flow: row;
					gap: var(--small-gap);

					& > li {
						border-radius: 50%;
						background-color: var(--background-second-color);

                        & > button > img {
                            height: var(--large-gap);
                        }
					}
				}

				& > pokemon-preview {
                    &:first-of-type {
                        grid-area: left-preview;
                    }

                    &:last-of-type {
                        grid-area: right-preview
                    }
				}

                & > ul.actions {
                    grid-area: actions;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 100%;
                    justify-content: space-evenly;
                    z-index: 2;
                }

                & > output.damage-calculator {
                    grid-area: dmg-calc;
                    border-radius: var(--border-r-50);
                    background-color: var(--background-color);
                    width: 100%;
                }
			}
		}
	}
</style>
