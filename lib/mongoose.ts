import mongoose from 'mongoose';


let isConnected : boolean = false ;


// To Connect with Database
export const connectToDatabase = async () => {
  
    mongoose.set("strictQuery",true)

    if (!process.env.MONGODB_URL) {
        return console.log("Missing MONGODB URL")
    }

    if (isConnected) {
        return console.log("MongoDB is already connected")
    }

    try {
      await  mongoose.connect(process.env.MONGODB_URL,{
        dbName: "DevFlow"
      })

      isConnected = true
    } catch (error) {
        console.log("MongoDB connection failed",error)
    }
}