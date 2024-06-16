import type { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import type { Lightkemon } from "$lib/types/lightkemon";
import db from "../mongoose";

const { Schema } = db;

type LightkemonQueryFunction = QueryWithHelpers<HydratedDocument<Lightkemon[]>, HydratedDocument<Lightkemon>, LightkemonQueryHelpers>;
type LightkemonLModelType = Model<Lightkemon, LightkemonQueryHelpers>;

interface LightkemonQueryHelpers {
    bulkById(left: number, right: number): LightkemonQueryFunction
}


const lightkemonSchema = new Schema<Lightkemon, LightkemonLModelType, {}, LightkemonQueryHelpers>({
    id: Number,
    name: String,
    types: [String],
    i18n: { fr: String, en: String }
}, {
    query: {
        bulkById(this: LightkemonQueryFunction, left: number, right: number) {
            return this.where("id").gte(left).lte(right).sort("id");
        }
    }
});

export const lightkedex = db.models.lightkedex as LightkemonLModelType || db.model<Lightkemon, LightkemonLModelType>('lightkedex', lightkemonSchema);
