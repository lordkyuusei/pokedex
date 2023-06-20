import POKEMON_TYPES from "$lib/constants/pokemon_types";
import type { PokemonType } from "$lib/types/pokemonTypes";
import extractDuplicates from "./extractDuplicatesFromArray";

export const fetchFullTypes = (types: string[]) =>
    types.reduce((acc, type) => {
        const ref = POKEMON_TYPES.find((t) => t.name === type);
        return ref ? [...acc, ref] : acc;
    }, [] as PokemonType[]);

export const computeAffinities = (types: PokemonType[]) => {
    const immunities = types.flatMap((type) =>
        POKEMON_TYPES.filter((t) => type.immunities.includes(t.id))
    );
    const rawRawResistances = types.flatMap((pkmnType) =>
        POKEMON_TYPES.filter((t) => !immunities.includes(t)).filter((t) =>
            pkmnType.resistances.includes(t.id)
        )
    );
    const rawResistances = rawRawResistances.filter(
        (t) => types.findIndex((pkmnType) => pkmnType.weaknesses.includes(t.id)) === -1
    );
    const [doubleResistances, resistances] = extractDuplicates(rawResistances, 'name');
    const neutral = rawRawResistances.filter((t) => !resistances.includes(t));
    const rawWeaknesses = types.flatMap((pkmnType) =>
        POKEMON_TYPES.filter((t) => ![...immunities, ...resistances, ...neutral].includes(t)).filter(
            (t) => pkmnType.weaknesses.includes(t.id)
        )
    );
    const [doubleWeaknesses, weaknesses] = extractDuplicates(rawWeaknesses, 'name');
    return [
        { name: 'double-weaknesses', value: doubleWeaknesses },
        { name: 'weaknesses', value: weaknesses },
        { name: 'resistances', value: resistances },
        { name: 'double-resistances', value: doubleResistances },
        { name: 'immunities', value: immunities }
    ];
};

export const computeCoverage = (types: PokemonType[]) => {
    const [firstType, secondType] = types;
    const superEffective = [
        ...new Set(
            types.flatMap((pkmnType) => POKEMON_TYPES.filter((t) => t.weaknesses.includes(pkmnType.id)))
        )
    ];
    const rawNotEffective = POKEMON_TYPES.filter((t) => !superEffective.includes(t)).filter((t) =>
        t.resistances.includes(firstType.id)
    );
    const notEffective = secondType
        ? rawNotEffective.filter((t) => t.resistances.includes(secondType.id))
        : rawNotEffective;
    const rawIneffective = POKEMON_TYPES.filter(
        (t) => ![...superEffective, ...notEffective].includes(t)
    ).filter((t) => t.immunities.includes(firstType.id));
    const ineffective = secondType
        ? rawIneffective.filter((t) => t.immunities.includes(secondType.id))
        : rawIneffective;
    const output = [
        { name: 'super-effective', value: superEffective },
        { name: 'not-super-effective', value: notEffective },
        { name: 'no-effect', value: ineffective }
    ];
    return output;
};