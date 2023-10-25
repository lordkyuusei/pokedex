import { env } from "$env/dynamic/private";
import mongoose from "mongoose"

const mongoose$ = await mongoose.connect(env["CONNECTION_STRING"])

export default mongoose$;