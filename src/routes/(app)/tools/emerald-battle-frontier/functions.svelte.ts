import { battleStyleMoves, openLevelPokemonStart, swapsToUpperRoundPokemonThresholdsMap } from "$lib/constants/battle-factory";
import { computeAffinities, fetchFullTypes } from "$lib/functions/computeTypesRelationship";
import type { FactoryPokemon, FactoryPokemonRaw } from "$lib/types/battle-factory";
import type { LightMoveDetails } from "$lib/types/lightmove";
import type { PokemonAffinityType } from "$lib/types/pokemon-affinity";
import type { PokemonType } from "$lib/types/pokemonTypes";

export const onRoundChange = (pokemonList: FactoryPokemon[], isLvl100Mode: boolean, [nbRounds, nbSwaps,]: [number, number, number], teamSize: number, isRentalMode: boolean) =>
    pokemonList.filter((pokemon) => {
        const levelCondition = isLvl100Mode ? pokemon.id >= openLevelPokemonStart : pokemon.id < openLevelPokemonStart;
        const swapsThreshold = swapsToUpperRoundPokemonThresholdsMap.find(x => x.range[0] <= nbSwaps && nbSwaps <= x.range[1])?.amount ?? -1;
        const isUpperRoundEligible = teamSize < swapsThreshold && isRentalMode;
        const currentRound = isUpperRoundEligible ? nbRounds + 1 : nbRounds;
        return levelCondition && checkIsVariantMatching(pokemon.variant, currentRound, isLvl100Mode)
    });

export const onMovesChange = (result: FactoryPokemon[]): string[] => [
    ...new Set(result.flatMap((pokemon) => pokemon.moves.map((x) => x.name)))
];

export const onItemsChange = (result: FactoryPokemon[]): string[] => [
    ...new Set(result.map((pokemon) => pokemon.item))
];

export const checkAreMovesMatching = (moveset: string[], filteredMoves: string[]) =>
    filteredMoves.every((move) => moveset.includes(move));

/* Not suitable for lv50 yet */
export const checkIsVariantMatching = (
    variant: number,
    currentRound: number,
    isLvl100Mode: boolean
) => {
    if (isLvl100Mode && currentRound <= 4) return variant === currentRound;
    else return true;
};

export const onTeamChange = (pokemonList: FactoryPokemon[], pokemonTeam: FactoryPokemon[]) => {
    const offensiveMoves = [
        ...new Set(
            pokemonTeam.flatMap((x) =>
                x.moves.filter((m) => m.damageClass !== 'status').map((m) => m.moveType)
            )
        )
    ];

    const pokemonAffinities = pokemonList.map((p) => {
        const affinities = computeAffinities(fetchFullTypes(p.types));
        const affinitiesAsObject = affinities.reduce(
            (acc, affinity) => ({ ...acc, [affinity.name]: affinity.value }),
            {} as { [key in PokemonAffinityType]: PokemonType[] }
        );

        return {
            pokemon: p,
            ...affinitiesAsObject
        };
    });

    const coverageList = pokemonAffinities.reduce((list, affinity) => {
        if (offensiveMoves.every((type) => affinity['immunities'].some((dr) => dr.name === type))) {
            return { ...list, immune: [...list['immune'], affinity.pokemon] };
        } else if (
            offensiveMoves.every((type) =>
                affinity['double-resistances'].some((dr) => dr.name === type)
            )
        ) {
            return { ...list, 'double-resisted': [...list['double-resisted'], affinity.pokemon] };
        } else if (
            offensiveMoves.every((type) => affinity['resistances'].some((dr) => dr.name === type))
        ) {
            return { ...list, resisted: [...list['resisted'], affinity.pokemon] };
        } else if (affinity['weaknesses'].some((type) => offensiveMoves.includes(type.name))) {
            return { ...list, covered: [...list['covered'], affinity.pokemon] };
        } else if (
            affinity['double-weaknesses'].some((type) => offensiveMoves.includes(type.name))
        ) {
            return { ...list, 'double-covered': [...list['double-covered'], affinity.pokemon] };
        } else {
            return { ...list, normal: [...list['normal'], affinity.pokemon] };
        }
    }, {
        immune: [],
        'double-resisted': [],
        resisted: [],
        normal: [],
        covered: [],
        'double-covered': []
    } as { [key: string]: FactoryPokemon[] }
    );

    return coverageList;
};

export const compareMovesName = (target: string, source: string) => {
    if (source === 'hi jump kick') {
        return target === 'high jump kick';
    }

    if (source === 'faint attack') {
        return target === 'feint attack';
    }

    if (source === 'vicegrip') {
        return target === 'vise grip';
    }

    return (
        source === target ||
        source === target.replace(' ', '') ||
        source === target.replace('-', '') ||
        source === target.replace(' ', '-') ||
        source === target.replace(' ', '').slice(0, 12)
    );
};

type FactoryOptions = {
    isOpponent?: boolean,
    isRental?: boolean,
    teamLength?: number,
    isSeventhTrainer?: boolean
};

export const assignStatsToPokemon = (pokemon: FactoryPokemon, round: number, swaps: number, options: FactoryOptions): FactoryPokemon => {
    const mapIVsToRoundUser = [
        { c: (round: number) => round === 1, f: 3 },
        { c: (round: number) => round === 2, f: 6 },
        { c: (round: number) => round === 3, f: 9 },
        { c: (round: number) => round === 4, f: 12 },
        { c: (round: number) => round === 5, f: 15 },
        { c: (round: number) => round === 6, f: 21 },
        { c: (round: number) => round >= 7, f: 31 },
    ];

    if (options.isOpponent && options.isSeventhTrainer !== undefined) {
        const opponentIVs = options.isSeventhTrainer ? mapIVsToRoundUser.find(x => x.c(round + 1) === true)?.f ?? 3 : 3;
        const lv100Stats = pokemon.lv100Stats.map(stat => stat - 31 + opponentIVs) as [number, number, number, number, number, number];

        console.log("==== OPPONENT =====");
        console.log({ opponentIVs, old100Stats: pokemon.lv100Stats, lv100Stats });

        return {
            ...pokemon,
            lv100Stats
        }
    }

    if (options.isRental && options.teamLength !== undefined) {
        const mapSwapsToAmountStronger = [
            { c: (swaps: number) => swaps < 15, f: 0 },
            { c: (swaps: number) => swaps < 22, f: 1 },
            { c: (swaps: number) => swaps < 29, f: 2 },
            { c: (swaps: number) => swaps < 36, f: 3 },
            { c: (swaps: number) => swaps < 43, f: 4 },
            { c: (swaps: number) => swaps >= 43, f: 5 },
        ];

        const amountOfStrongerPokemon = mapSwapsToAmountStronger.find(x => x.c(swaps) === true)?.f ?? 0;
        const effectiveRound = amountOfStrongerPokemon > options.teamLength ? round + 1 : round;
        const userIVs = mapIVsToRoundUser.find(x => x.c(effectiveRound) === true)?.f ?? 3;
        const lv100Stats = pokemon.lv100Stats.map(stat => stat - 31 + userIVs) as [number, number, number, number, number, number]

        console.log("==== RENTAL =====");
        console.log({ amountOfStrongerPokemon, round, effectiveRound, l: options.teamLength, userIVs, old100Stats: pokemon.lv100Stats, lv100Stats });
        return {
            ...pokemon,
            lv100Stats
        }
    }

    const userIVs = mapIVsToRoundUser.find(x => x.c(round) === true)?.f ?? 3;
    return {
        ...pokemon,
        lv100Stats: pokemon.lv100Stats.map(stat => stat - 31 + userIVs) as [number, number, number, number, number, number]
    }
}

export const replacePokemonFairyType = (pokemon: FactoryPokemonRaw[]): FactoryPokemonRaw[] => pokemon.map(p => ({
    ...p,
    types: p.types.includes('fairy') ? (p.types.length === 2 ? p.types.filter(t => t !== 'fairy') : ['normal']) : p.types
}));

export const assignMovesToPokemon = (pokemon: FactoryPokemonRaw[], moves: LightMoveDetails[]): FactoryPokemon[] => {
    return pokemon.map((raw) => {
        const {
            '1stMove': fMove,
            '2ndMove': sMove,
            '3rdMove': tMove,
            '4thMove': foMove,
            lv50Stats,
            lv100Stats,
            ...rest
        } = raw;

        const details = [fMove, sMove, tMove, foMove]
            .map((m) => {
                const name = m.toLocaleLowerCase();
                const details = moves.find((md) => compareMovesName(md.i18n.en.toLocaleLowerCase(), name));
                if (!details) return null;

                if (details.moveType === 'fairy') {
                    details.moveType = 'normal';
                }

                const style = battleStyleMoves.findIndex(bsm => bsm.moves.includes(details.name));
                return { ...details, style };
            })
            .filter((x) => x !== null);

        return { ...rest, lv100Stats, lv50Stats, lv100MaxStats: lv100Stats, lv50MaxStats: lv50Stats, moves: details, meta: { isOpponent: false, isTeamed: false, isRental: false, isOpponentSelected: false, isTeamSelected: false } };
    });
};

export const onSearchChange = (list: FactoryPokemon[], input: string, teamedPokemon: FactoryPokemon[], opponentPokemon: FactoryPokemon[]): FactoryPokemon[] => {
    if (input.length <= 2) {
        return [];
    }

    const result: FactoryPokemon[] = list.filter((pkmn) => {
        const { id, i18n, name } = pkmn;

        const isAlreadyPicked = teamedPokemon.map((x) => x.id).includes(id) || opponentPokemon.map((x) => x.id).includes(id);
        if (isAlreadyPicked) return false;

        const searchTokens = input.toLocaleLowerCase().split(' ');

        const filteredTokens = searchTokens.map((token) => {
            const [identifier, ...rest] = token;
            const search = rest.join('').replace('-', ' ');

            if (identifier === '@') {
                const item = pkmn.item.toLocaleLowerCase();
                return item.startsWith(search) && !opponentPokemon.some((op) => op.item.startsWith(item));
            }

            if (identifier === '-') {
                const moves = pkmn.moves.flatMap((m) => [m.name.toLocaleLowerCase(), m.i18n.fr.toLocaleLowerCase()]);
                return moves.some((m) => m.startsWith(search));
            }

            if (identifier === '#') {
                const styles = pkmn.moves.map((m) => m.style);
                return styles.some((m) => m === Number(search));
            }

            if (identifier === '$') {
                return pkmn.types.some(t => t.startsWith(search))
            }

            const ids = [name.toLocaleLowerCase(), i18n.en.toLocaleLowerCase(), i18n.fr.toLocaleLowerCase()];
            return ids.some((id) => id.startsWith(token));
        });

        return filteredTokens.every((token) => token === true);
    });

    return result.slice(0, 10);
};
