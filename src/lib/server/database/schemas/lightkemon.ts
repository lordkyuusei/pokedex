import type { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import type { Lightkemon } from "$lib/types/lightkemon";
import db from "../mongoose";

const { Schema } = db;

type LightkemonQueryFunction = QueryWithHelpers<HydratedDocument<Lightkemon[]>, HydratedDocument<Lightkemon>, LightkemonQueryHelpers>;
type LightkemonLModelType = Model<Lightkemon, LightkemonQueryHelpers>;

interface LightkemonQueryHelpers {}

const lightkemonSchema = new Schema<Lightkemon, LightkemonLModelType, {}, LightkemonQueryHelpers>({
    id: Number,
    name: String,
    dexes: [{ games: [String], number: Number }],
    types: [String],
    i18n: { fr: String, en: String }
}, {});

export const lightkedex = db.models.lightkedex as LightkemonLModelType || db.model<Lightkemon, LightkemonLModelType>('lightkedex', lightkemonSchema);
