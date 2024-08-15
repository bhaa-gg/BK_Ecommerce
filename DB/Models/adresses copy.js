


import mongoose from "../global-setup.js";
import { schemaModels } from './../../src/Utils/index.js';
const ObjectId = mongoose.Types.ObjectId;

const { model, Schema, Types } = mongoose;

const addressesSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    postalCode: {
        type: Number,
        required: true,
    },
    buildingNumber: {
        type: Number,
        required: true,
    },
    floorNumber: {
        type: Number,
        required: true,
    },
    addressLabel: String,
    isDefault: {
        type: Boolean,
        default: false,
    },
    isMarkedAsDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    ...schemaModels
})


// addressesSchema.index({ postalCode: 1, floorNumber: 1, country: 1, city: 1, buildingNumber: 1 }, { unique: true });


addressesSchema.pre("save", async function (next) {
    const count = await addressesModel.countDocuments();
    if (this.isDefault && count > 1) {
        await addressesModel?.updateMany({ userId: { $ne: new ObjectId(this._id) }, isDefault: true }, { isDefault: false })
    }
    next();
})

addressesSchema.post("findOneAndUpdate", async function (doc, next) {

    const count = await addressesModel.countDocuments();
    if (doc && !doc.isDefault && count > 1 && doc.isMarkedAsDeleted) {
        await addressesModel.updateOne(
            { userId: doc.userId, _id: { $ne: doc._id }, isMarkedAsDeleted: false },
            { isDefault: true },
        );
    }
})


export const addressesModel = model('Address', addressesSchema)