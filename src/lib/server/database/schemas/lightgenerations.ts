import type { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import type { Generation } from "$lib/types/generation";
import db from "../mongoose";

const { Schema } = db;

type GenerationModelType = Model<Generation, GenerationQueryHelpers>;
type GenerationQueryFunction = QueryWithHelpers<HydratedDocument<Generation[]>, HydratedDocument<Generation>, GenerationQueryHelpers>;

interface GenerationQueryHelpers {
    bulkByGen(left: number, right: number): GenerationQueryFunction
}

const lightgenerationsSchema = new Schema<Generation, GenerationModelType, {}, GenerationQueryHelpers>({
    id: Number,
    name: String,
    boundaries: { from: Number, to: Number },
    region: {
        name: String,
        i18n: { fr: String, en: String }
    },
    versionsGroup: [{
        name: String,
        games: [{
            name: String,
            i18n: { fr: String, en: String }
        }],
        pokedexes: [{
            id: Number,
            name: String
        }]
    }],
    i18n: { fr: String, en: String }
}, {
    query: {
        bulkByGen(this: GenerationQueryFunction, left: number, right: number) {
            return this.where("id").gte(left).lt(right).sort("id")
        }
    }
})
export const lightgenerations = db.models.lightgenerations as GenerationModelType || db.model<Generation, GenerationModelType>('lightgenerations', lightgenerationsSchema);
