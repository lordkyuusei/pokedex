export type Generation = {
    id: number,
    name: string,
    boundaries: { from: number, to: number },
    region: {
        name: string,
        i18n: { fr: string, en: string }
    },
    versionsGroup: VersionGroup[],
    i18n: { fr: string, en: string }
}

export type VersionGroup = {
    name: string,
    games: {
        name: string,
        i18n: { fr: string, en: string }
    }[],
    pokedexes: {
        id: number,
        name: string
    }[]
}

export type LightVersion = {
    id: string;
    name: string;
}