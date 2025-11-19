import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb+srv://ayush:ayush@cluster0.ufzqnsa.mongodb.net/petroldb")
        console.log("MongoDB Connected at ", connectionInstance.connection.port);
    } catch (error) {
        console.log(error)
    }
}