import db from "./mongoose";

import type { Generation } from "$lib/types/generation";
import type { Lightkemon } from "$lib/types/lightkemon";
import type { LightMove } from "$lib/types/lightmove";
import type { Ability } from "$lib/types/abilitiy";

const { Schema } = db;

const lightkemonSchema = new Schema<Lightkemon>({
    id: Number,
    name: String,
    types: [String],
    i18n: { fr: String, en: String }
}, {
    query: {
        bulkById(left: number, right: number) {
            return this.where("id").gte(left).lte(right).sort("id")
        }
    }
});

const lightgenerationsSchema = new Schema<Generation>({
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
        bulkByGen(left: number, right: number) {
            return this.where("id").gte(left).lt(right).sort("id")
        }
    }
})

const lightmovesSchema = new Schema<LightMove>({
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
        all() {
            return this;
        },
        getMoveById(id: number) {
            return this.where("moves.id").equals(id);
        },
        typeCountByGen(id: number) {
            return this.where("id").lte(id).select({ "moves.moveType": 1 });
        },
        allTypes(type: string) {
            return this.where("moves.moveType").equals(type);
        }
    }
})

const lightabilitiesSchema = new Schema<Ability>({
    id: Number,
    name: String,
    generation: Number,
    i18nFlavor: { fr: String, en: String },
    i18nName: { fr: String, en: String }
}, {
    query: {
        getAll() {
            return this;
        },
        getAbilitiesLteGen(id: number) {
            return this.where("generation").lte(id).sort("id");
        },

    }
})

export const lightkedex = db.model('lightkedex', lightkemonSchema);
export const lightmoves = db.model('lightmoves', lightmovesSchema);
export const lightgenerations = db.model('lightgenerations', lightgenerationsSchema);
export const lightabilities = db.model('lightabilities', lightabilitiesSchema);