


import { DiscountType, schemaModels } from '../../src/Utils/index.js';
import mongoose from "../global-setup.js";
const ObjectId = mongoose.Types.ObjectId;

const { model, Schema, Types } = mongoose;

const couponSchema = new Schema({

    couponCode: {
        type: String,
        unique: true,
        required: true,
    },

    couponAmount: {
        type: Number,
        required: true,
    },
    couponType: {
        type: String,
        required: true,
        enum: Object.values(DiscountType),
    },
    from: {
        type: Date,
        required: true,
    },
    till: {
        type: Date,
        required: true,
    },
    Users: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
            maxCount: {
                type: Number,
                required: true,
                min: 1
            },
            usageCount: {
                type: Number,
                default: 0,
            },
        }
    ],

    isEnabled: {
        type: Boolean,
        default: true,
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }

}, {
    ...schemaModels
})



export const couponModel = model('Coupon', couponSchema)