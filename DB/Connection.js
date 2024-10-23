import mongoose from "mongoose"





export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URIL).then(() => console.log("Connection Success"))
        .catch(err => console.log(err))
}
