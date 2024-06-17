import type { HydratedDocument, Model, QueryWithHelpers } from "mongoose";
import type { LightMove } from "$lib/types/lightmove";
import db from "../mongoose";

const { Schema } = db;

type LightMoveModelType = Model<LightMove, LightMoveQueryHelpers>;
type LightMoveQueryFunction = QueryWithHelpers<HydratedDocument<LightMove[]>, HydratedDocument<LightMove>, LightMoveQueryHelpers>;

interface LightMoveQueryHelpers {
    all(): LightMoveQueryFunction
    getMoveById(id: number): LightMoveQueryFunction
    typeCountByGen(id: number): LightMoveQueryFunction
    allTypes(type: string): LightMoveQueryFunction
}

const lightmovesSchema = new Schema<LightMove, LightMoveModelType, {}, LightMoveQueryHelpers>({
    id: Number,
    generation: String,
    moves: [{
        id: Number,
        name: String,
        power: Number,
        accuracy: Number,
        pp: Number,
        moveType: String,
        damageClass: String,
        i18n: { fr: String, en: String }
    }]
}, {
    query: {
        all(this: LightMoveQueryFunction) {
            return this;
        },
        getMoveById(this: LightMoveQueryFunction, id: number) {
            return this.where("moves.id").equals(id);
        },
        typeCountByGen(this: LightMoveQueryFunction, id: number) {
            return this.where("id").lte(id).select({ "moves.moveType": 1 })
        },
        allTypes(this: LightMoveQueryFunction, type: string) {
            return this.where("moves.moveType").equals(type);
        }
    }
})
export const lightmoves = db.models.lightmoves as LightMoveModelType || db.model<LightMove, LightMoveModelType>('lightmoves', lightmovesSchema);
