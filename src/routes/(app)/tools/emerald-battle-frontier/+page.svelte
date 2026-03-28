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
	let isRentalMode: boolean = $state(true);
	let showCoverageDialog: boolean = $state(false);

	let factoryPokemonList: FactoryPokemon[] = $state([]);
	let selectedMove: (LightMoveDetails & { style: number }) | null = $state(null);

	let rentalPokemon = $derived(factoryPokemonList.filter((x) => x.meta.isRental));
	let teamedPokemon = $derived(factoryPokemonList.filter((x) => x.meta.isTeamed));
	let opponentPokemon = $derived(factoryPokemonList.filter((x) => x.meta.isOpponent));
	let selectedTeamedPokemon = $derived(factoryPokemonList.find((x) => x.meta.isTeamSelected));
	let selectedOpponentPokemon = $derived(factoryPokemonList.find((x) => x.meta.isOpponentSelected));
	let availablePokemon = $derived(onRoundChange(factoryPokemonList, isLvl100Mode, roundSwapsBattles, rentalPokemon.length, isRentalMode));

    let damageCalculatorUser = $derived(selectedTeamedPokemon);
    let damageCalculatorTarget = $derived(selectedOpponentPokemon);
	let factoryCoverage = $derived(onTeamChange(availablePokemon, teamedPokemon));
	let matchingResult = $derived(onSearchChange(availablePokemon, searchInput, teamedPokemon, opponentPokemon));

    const resetOpponentPokemon = () => {
        opponentPokemon.forEach(pokemon => {
            const factoryPokemonIndex = factoryPokemonList.findIndex(x => x.id === pokemon.id);
            factoryPokemonList = factoryPokemonList.with(factoryPokemonIndex, {
                ...factoryPokemonList[factoryPokemonIndex],
                meta: { ...factoryPokemonList[factoryPokemonIndex].meta, isOpponent: false, isOpponentSelected: false }
            })
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

        console.log(id, nextSelectedPokemonIndex, factoryPokemonList[nextSelectedPokemonIndex]);

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

        const selectedTeamedIndex = factoryPokemonList.findIndex(x => x.id === selectedTeamedPokemon.id);
        const selectedOpponentIndex = factoryPokemonList.findIndex(x => x.id === selectedOpponentPokemon.id);
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

        damageCalculatorUser = factoryPokemonList.find(t => t.id === id);
	};

	const handleSearchSubmit = (event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (event.key !== 'Enter') return;

		const firstMatch = matchingResult[0];
		if (!firstMatch) return;

		if (isRentalMode) toggleRentalPokemon({ id: firstMatch.id, checked: true });
		else toggleOpponentPokemon({ id: firstMatch.id, checked: true });

		matchingResult = [];
		searchInput = '';
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
</script>

<section id="tool-battle-frontier">
	<header data-title={localData ? 'Local data' : 'Data from Excel Sheet'}>
		<div class="search">
			<input
				type="search"
				bind:value={searchInput}
				disabled={factoryPokemonList.length === 0}
				placeholder="name @held-item -move-name $type  #battle-style-number"
				onkeypress={handleSearchSubmit}
			/>
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
					on:showEfficiency={(e) => (showCoverageDialog = e.detail.showEfficiency)}
				></Switch>
				<Switch customName event="showHelp" icon="pokedex" defaultState={showHelp} on:showHelp={(e) => (showHelp = e.detail.showHelp)}></Switch>
			</fieldset>
			{#if dev}
				<fieldset>
					<legend>Fill Test/ Sync DB / Delete DB</legend>
					<button id="fill-sheet" onclick={fillTestData}>🎴</button>
				</fieldset>
			{/if}
		</div>
	</header>

	{#if showCoverageDialog}
		<BattleFrontierCoverage {factoryCoverage} {teamedPokemon} {updateSearch}></BattleFrontierCoverage>
	{:else if showHelp}
		<BattleFrontierHelpScreen></BattleFrontierHelpScreen>
	{:else if isRentalMode}
		<output class="rental">
			<ul class="rental-team">
				{#each rentalPokemon as pokemon}
					{#if rentalPokemon.length === 6}
						<PokemonCard {pokemon} {roundSwapsBattles} {isLvl100Mode} onHire={toggleRentalToTeamedPokemon}></PokemonCard>
					{:else}
						<PokemonCard {pokemon} {roundSwapsBattles} {isLvl100Mode} onRental={toggleRentalPokemon}></PokemonCard>
					{/if}
				{/each}
			</ul>
			<hr />
			<ul class="search result">
				{#if matchingResult.length === 0 && searchInput.length > 3}
					No result. Please make sure the Pokemon you're looking for exists, and is not already picked in one of the teams.
				{:else if matchingResult.length === 0 && teamedPokemon.length !== 3}
					Start adding your rental team by searching for them & toggling the left switch button on each result.
				{:else}
					{#each matchingResult as pokemon (pokemon.id)}
						{#if !pokemon.meta.isOpponent && !pokemon.meta.isTeamed}
							<li>
								<PokemonCard {pokemon} {roundSwapsBattles} {isLvl100Mode} open={matchingResult.length === 1} onRental={toggleRentalPokemon}
								></PokemonCard>
							</li>
						{/if}
					{/each}
				{/if}
			</ul>
		</output>
	{:else}
		<output>
			<my-team data-title="M. Team">
				<ul>
					{#each teamedPokemon as pokemon}
						<li>
							<button class="round" class:selected={selectedTeamedPokemon?.id === pokemon.id} onclick={() => setSelectedTeamedPokemon(pokemon.id)}>
								<img src={fetchPokemonSpriteURL(pokemon.dexId)} alt={pokemon.name} />
							</button>
						</li>
					{/each}
					{#each Array.from({ length: 3 - teamedPokemon.length }) as _}
						<li>
							<button class="round">
								<img src={fetchPokemonSpriteURL(0)} alt={'No Pokémon Selected'} />
							</button>
						</li>
					{/each}
				</ul>
			</my-team>

			<my-selected-pokemon data-title="Selected team member">
				{#if selectedTeamedPokemon}
					<PokemonCard open {roundSwapsBattles} pokemon={selectedTeamedPokemon} {isLvl100Mode} isSelectedMoveUser={selectedTeamedPokemon.id === damageCalculatorUser?.id} onMoveSelection={setSelectedMove}></PokemonCard>
				{/if}
			</my-selected-pokemon>

			<their-selected-pokemon data-title="Selected opponent">
				{#if selectedOpponentPokemon}
					<PokemonCard open {roundSwapsBattles} pokemon={selectedOpponentPokemon} {isLvl100Mode} isSelectedMoveUser={selectedOpponentPokemon.id === damageCalculatorUser?.id} onMoveSelection={setSelectedMove}></PokemonCard>
				{/if}
			</their-selected-pokemon>

			<their-team data-title="O. Team">
				<ul>
					{#each opponentPokemon as pokemon}
						<li>
							<button
								class="round"
								class:selected={selectedOpponentPokemon?.id === pokemon.id}
								onclick={() => setSelectedOpponentPokemon(pokemon.id)}
							>
								<img src={fetchPokemonSpriteURL(pokemon.dexId)} alt={pokemon.name} />
							</button>
						</li>
					{/each}
					{#each Array.from({ length: 3 - opponentPokemon.length }) as _}
						<li>
							<button class="round">
								<img src={fetchPokemonSpriteURL(0)} alt={'No Pokémon Selected'} />
							</button>
						</li>
					{/each}
				</ul>
			</their-team>
			<div class="actions">
				<button class="primary round" title="Swap Pokemon" onclick={() => swapPokemon()}>⬅️</button>
				<button class="primary round" title="Reject Pokemon" onclick={() => doNotSwapPokemon()}>✖️</button>
			</div>
			{#if selectedTeamedPokemon && selectedOpponentPokemon && selectedMove}
				<span>
					<BattleFrontierDamageCalculator user={damageCalculatorUser} target={damageCalculatorTarget} move={selectedMove} isLvl100Mode
					></BattleFrontierDamageCalculator>
				</span>
			{/if}
			<hr />
			<ul class="search result">
				{#if matchingResult.length === 0 && searchInput.length > 3}
					No result. Please make sure the Pokemon you're looking for exists, and is not already picked in one of the teams.
				{:else if matchingResult.length === 0 && teamedPokemon.length !== 3}
					Start adding your rental team by searching for them & toggling the left switch button on each result.
				{:else}
					{#each matchingResult as pokemon (pokemon.id)}
						{#if !pokemon.meta.isOpponent && !pokemon.meta.isTeamed}
							<li>
								<PokemonCard
									{pokemon}
									{roundSwapsBattles}
									isLvl100Mode
									open={matchingResult.length === 1}
									onHire={toggleTeamedPokemon}
									onBattle={toggleOpponentPokemon}
								></PokemonCard>
							</li>
						{/if}
					{/each}
				{/if}
			</ul>
		</output>
	{/if}
</section>

<style>
	section#tool-battle-frontier {
		height: 100%;
		width: 100%;
		padding: var(--small-gap);

		display: grid;
		grid-template-rows: auto 1fr;

		position: relative;

		& > header {
			position: sticky;
			top: 0;
			display: grid;
			grid-template: 'search search' 1fr / 1fr 1fr;
			gap: var(--small-gap);
			padding: var(--small-gap);
			background: var(--background-second-color);
			border-radius: var(--smaller-gap) var(--smaller-gap) 0 0;
			z-index: 2;

			@media (max-width: 640px) {
				grid-template: 'search search' 1fr / 1fr 1fr;
			}

			& > div.search {
				display: grid;
				grid-auto-flow: column;
				grid-template-columns: 1fr repeat(4, auto);
				align-items: end;
				grid-column: 1 / -1;
				gap: var(--small-gap);

				@media (max-width: 640px) {
					grid-template-rows: 1fr auto;

					& > input {
						grid-area: 1 / 1 / 1 / -1;
					}

					& > :not(input) {
						grid-row: 2;
					}
				}

				& > input {
					height: calc(100% - var(--smaller-gap));
					background-color: var(--background-second-color);
				}
			}
		}

		& > output {
			display: grid;
			grid-template:
				'header header header header header' auto
				'my-team preview-me actions preview-them their-team' 1fr
				'dmg-calc dmg-calc dmg-calc dmg-calc dmg-calc' auto
				'separator separator separator separator separator' auto
				'search search search search search' 2fr / auto 1fr 0px 1fr auto;

			gap: var(--small-gap);
			padding: 0 var(--small-gap);
			border-radius: 0 0 var(--smaller-gap) var(--smaller-gap);
			background-color: var(--background-second-color);
			overflow: hidden;

			&.rental {
				grid-template:
					'header header header header header' auto
					'rental rental rental rental rental ' auto
					'separator separator separator separator separator' auto
					'search search search search search' 2fr / auto 1fr 0px 1fr auto;
			}
			& > my-team {
				grid-area: my-team;
			}

			& > their-team {
				grid-area: their-team;
			}

			& > my-team,
			& > their-team {
				& > ul {
					display: flex;
					flex-direction: column;
					justify-content: center;
					gap: var(--small-gap);
					height: 100%;

					& > li {
						& > button {
							width: var(--large-gap);
							padding: 0;

							& > img {
								inline-size: 100%;
							}
						}
					}
				}
			}

			& > div.actions {
				grid-area: actions;
				display: flex;
				flex-direction: column;
				align-self: center;
				justify-self: center;
				gap: var(--normal-gap);

				& > button.round {
					border: 0;
					width: var(--medium-gap);
				}
			}

			& > span {
				grid-area: dmg-calc;
				display: flex;
				width: 100%;
			}

			& > my-team,
			& > their-team,
			& > my-selected-pokemon,
			& > their-selected-pokemon {
				padding: var(--small-gap);
				border-radius: var(--smaller-gap);
				background-color: var(--background-color);
			}

			& > my-selected-pokemon,
			& > their-selected-pokemon {
				container: pokemon-preview / inline-size;
			}

			& > my-selected-pokemon {
				grid-area: preview-me;
			}

			& > their-selected-pokemon {
				grid-area: preview-them;
			}

			& > hr {
				grid-area: separator;
			}

			& > ul.rental-team {
				grid-area: 1 / 1 / 3 / -1;
				display: grid;
				grid-template: auto auto auto / 1fr 1fr;
				gap: var(--small-gap);
			}

			& > ul.search {
				grid-area: search;
				overflow-y: auto;

				display: flex;
				flex-direction: column;
				gap: var(--small-gap);

				& > li {
					container: pokemon-preview / inline-size;
				}
			}
		}
	}

	@media (max-width: 640px) {
		section#tool-battle-frontier {
			padding: var(--small-gap) 0;
		}

		section#tool-battle-frontier > header > div {
			overflow-x: auto;
		}

		section#tool-battle-frontier > output.rental {
			grid-template:
				'header' auto
				'rental' 1fr
				'separator' auto
				'search' 3fr / 1fr;
		}

		section#tool-battle-frontier > output.rental > ul.rental-team {
			grid-template-columns: 1fr;
			grid-auto-flow: row;
			overflow-y: auto;
		}

		section#tool-battle-frontier > output:not(.rental) {
			overflow-x: auto;
			grid-template:
				'header header header' auto
				'my-team . their-team' auto
				'preview-me actions preview-them' auto
				'dmg-calc dmg-calc dmg-calc' auto
				'separator separator separator' auto
				'search search search' 2fr / 1fr 1px 1fr;
		}

		section#tool-battle-frontier > output:not(.rental) > my-team > ul {
			flex-direction: row;
		}

		section#tool-battle-frontier > output:not(.rental) > their-team > ul {
			flex-direction: row;
		}
	}
</style>
