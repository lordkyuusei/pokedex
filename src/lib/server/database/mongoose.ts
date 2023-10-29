import { env } from "$env/dynamic/private";
import mongoose, { STATES } from "mongoose"

let mongooseDb: typeof mongoose;

if (mongoose.connection.readyState === STATES.disconnected) {
    mongooseDb = await mongoose.connect(env["CONNECTION_STRING"])
} else {
    mongooseDb = mongoose;
}

export default mongooseDb;