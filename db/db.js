import mongoose from "mongoose"

const connectDB = async () => {
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log(`Connected to db`);
    })
    .catch(err => console.log(err))
}

export default connectDB