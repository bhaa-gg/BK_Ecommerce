import mongoose from "mongoose"





export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connection Success"))
        .catch(ere => console.log(err))
}