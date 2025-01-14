import mongoose from "mongoose"
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

let isConnected = false

export const connectToDB = async () => {
    if (!process.env.MONGODB_URL) {
        return console.log("MongoDB URL is missing")
    }
    if (isConnected) {
        return console.log("Already Connected to DB")
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true

        console.log("Connected to DB")
    }
    catch (err) {
        console.log(err)
    }
}