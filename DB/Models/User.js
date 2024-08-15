import { hashSync } from "bcrypt";
import { Genderse, schemaModels, UserType } from "../../src/Utils/index.js";
import mongoose from "../global-setup.js";

const { model, Schema } = mongoose;

//{ document: true, query: false }
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: Object.values(UserType),
        default: UserType.USER
    },
    age: {
        type: Number,
        min: 5,
    },
    gender: {
        type: String,
        required: true,
        enum: Object.values(Genderse),
    },
    phone: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    passwordChangedAt: Date,
    isMarketAsDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    ...schemaModels
})




userSchema.pre("save", function (next) {

    console.log("from pre save");

    if (this.isModified("password")) this.password = hashSync(this.password, +process.env.SALT_ROUNDS)

    next();
})





// =========================================================================

userSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {

    console.log({ message: "pre Hooks query", me: this });

    if (this._update.password)
        this._update.password = hashSync(this._update.password, +process.env.SALT_ROUNDS)


    next();
})


// userSchema.post(["updateOne", "findOneAndUpdate"], function (doc, next) {

//     console.log({
//         message: "post Hooks query", doc,
//         queryByGetQuery: this.getQuery(),
//         queryByGetFilter: this.getFilter(),
//         getOptions: this.getOptions(), // third parameter in query
//         getUpdate: this.getUpdate(), // get updated fields
//         projection: this.projection(), // get the selected fields from select method 
//     });
//     next();
// })


export const userModel = model('User', userSchema)