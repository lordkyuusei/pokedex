import type { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import db from "../mongoose";
import type { Ability } from "$lib/types/abilitiy";

const { Schema } = db;

type AbilityModelType = Model<Ability, AbilityQueryHelpers>;
type AbilityQueryFunction = QueryWithHelpers<HydratedDocument<Ability[]>, HydratedDocument<Ability>, AbilityQueryHelpers>;

interface AbilityQueryHelpers {
    getAll(): AbilityQueryFunction
    getAbilitiesLteGen(id: number): AbilityQueryFunction
}

const lightabilitiesSchema = new Schema<Ability, AbilityModelType, {}, AbilityQueryHelpers>({
    id: Number,
    name: String,
    generation: Number,
    i18nFlavor: { fr: String, en: String },
    i18nName: { fr: String, en: String }
}, {
    query: {
        getAll(this: AbilityQueryFunction) {
            return this;
        },
        getAbilitiesLteGen(this: AbilityQueryFunction, id: number) {
            return this.where("generation").lte(id).sort("id");
        },

    }
})
export const lightabilities = db.models.lightabilities as AbilityModelType || db.model<Ability, AbilityModelType>('lightabilities', lightabilitiesSchema);
