import mongoose from "mongoose"

await mongoose.connect('mongodb://127.0.0.1:27017/thedex').then(
    () => console.log('MongoDB launched'),
    error => console.error('MongoDB failure')
);

export default mongoose;