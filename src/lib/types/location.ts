export type Location = {
    name: string,
    generation: number,
    regions: Region[]
}

type Region = {
    name: string,
    locations: LocationNode[]
}

export type LocationNode = {
    id: string,
    areas: LocationArea[]
}

export type LocationArea = {
    id: number,
    name: string,
    coords: number[],
    i18nName: { fr: string, en: string }
}