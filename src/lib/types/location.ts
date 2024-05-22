export type Location = {
    name: string,
    generation: number,
    regions: Region[]
}

type Region = {
    name: string,
    locations: LocationNode[]
}

type LocationNode = {
    id: string,
    areas: Area[]
}

type Area = {
    id: number,
    name: string,
    i18nName: { fr: string, en: string }
}