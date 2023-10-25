import mongoose from "mongoose"

await mongoose.connect('').then(
    () => console.log('MongoDB launched'),
    error => console.error('MongoDB failure')
);

export default mongoose;