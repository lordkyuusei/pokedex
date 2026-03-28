import type { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import db from "../mongoose";
import type { FactoryPokemonRaw } from "$lib/types/battle-factory";

const { Schema } = db;

type FactoryPokemonModelType = Model<FactoryPokemonRaw, FactoryPokemonQueryHelpers>;
type FactoryPokemonQueryFunction = QueryWithHelpers<HydratedDocument<FactoryPokemonRaw[]>, HydratedDocument<FactoryPokemonRaw>, FactoryPokemonQueryHelpers>;

interface FactoryPokemonQueryHelpers {
    getAll(): FactoryPokemonQueryFunction
    getAbilitiesLteGen(id: number): FactoryPokemonQueryFunction
}

const lightemeraldbattlefrontierSchema = new Schema<FactoryPokemonRaw, FactoryPokemonModelType, {}, FactoryPokemonQueryHelpers>({
    "id": Number,
    "dexId": Number,
    "name": String,
    "variant": Number,
    "types": Array<String>,
    "nature": String,
    "item": String,
    "1stMove": String,
    "2ndMove": String,
    "3rdMove": String,
    "4thMove": String,
    "ability": String,
    "evs": [Number, Number, Number, Number, Number, Number],
    "lv100Stats": [Number, Number, Number, Number, Number, Number],
    "lv50Stats": [Number, Number, Number, Number, Number, Number],
    "i18n": {
        fr: String, en: String
    }
}, {
    query: {}
})

export const lightEmeraldBattleFrontier = db.models.lightEmeraldBattleFrontier as FactoryPokemonModelType || db.model<FactoryPokemonRaw, FactoryPokemonModelType>('lightemeraldbattlefrontiers', lightemeraldbattlefrontierSchema);
