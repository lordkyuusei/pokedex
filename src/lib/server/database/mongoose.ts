import { env } from "$env/dynamic/private";
import mongoose, { STATES } from "mongoose"

let mongooseDb: typeof mongoose;

if (mongoose.connection.readyState === STATES.disconnected) {
    try {
        mongooseDb = await mongoose.connect(env["CONNECTION_STRING"])
    } catch (err) {
        console.error(err);
        mongooseDb = mongoose;
    }
} else {
    mongooseDb = mongoose;
}

export default mongooseDb;