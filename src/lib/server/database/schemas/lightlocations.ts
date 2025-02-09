import type { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import type { Location } from "$lib/types/location";
import db from "../mongoose";

const { Schema } = db;

interface LocationQueryHelpers {
    getAll(): QueryWithHelpers<HydratedDocument<Location[]>, HydratedDocument<Location>, LocationQueryHelpers>,
    getByVersionGroup(version: string): QueryWithHelpers<HydratedDocument<Location[]>, HydratedDocument<Location>, LocationQueryHelpers>
}

type LocationModelType = Model<Location, LocationQueryHelpers>;

const lightlocationsSchema = new Schema<Location, LocationModelType, {}, LocationQueryHelpers>({
    name: String,
    generation: Number,
    regions: [{
        name: String,
        locations: [{
            id: String,
            mapName: String,
            areas: [{
                id: Number,
                name: String,
                coords: Array<Number>,
                i18nName: { fr: String, en: String }
            }]
        }]
    }]
}, {
    query: {
        getAll(this: QueryWithHelpers<any, HydratedDocument<Location>, LocationQueryHelpers>) {
            return this;
        },
        getByVersionGroup(this: QueryWithHelpers<any, HydratedDocument<Location>, LocationQueryHelpers>, versionGroup: string) {
            return this.where("name").equals(versionGroup)
        }
    }
});

export const lightlocations = db.models.lightlocations as LocationModelType || db.model<Location, LocationModelType>('lightlocations', lightlocationsSchema);