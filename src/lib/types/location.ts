import { Types } from 'mongoose'

export type Location = {
    _id: Types.ObjectId,
    name: string,
    generation: number,
    regions: Region[]
}

type Region = {
    _id: Types.ObjectId,
    name: string,
    locations: LocationNode[]
}

export type LocationNode = {
    _id: Types.ObjectId,
    id: string,
    areas: LocationArea[]
}

export type LocationArea = {
    _id: Types.ObjectId,
    id: number,
    name: string,
    coords: number[],
    i18nName: { fr: string, en: string }
}