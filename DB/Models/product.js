import { Badges, calcPrice, DiscountType, schemaModels, SlugTitle } from './../../src/Utils/index.js';



import mongoose from "../global-setup.js";
const { model, Schema } = mongoose;


const proudctShema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
        default: function () {
            return SlugTitle(this.title);
        },
    },
    overview: String,
    specs: Object,
    badge: {
        type: String,
        enum: Object.values(Badges)
    },

    // Numbers Section

    price: {
        type: Number,
        required: true,
        min: 50,
    },
    appliedDiscount: {
        amount: {
            type: Number,
            min: 0,
            default: 0,
        },
        type: {
            type: String,
            enum: Object.values(DiscountType),
            default: DiscountType.PERCENTAGE,
        },
    },
    appliedPrice: {
        type: Number,
        required: true,
        default: function () {
            return calcPrice(this.price, this.appliedDiscount);
        },
    },
    stock: {
        type: Number,
        required: true,
        min: 10,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    //---
    Images: {
        URLs: [
            {
                secure_url: {
                    type: String,
                    required: true,
                },
                public_id: {
                    type: String,
                    required: true,
                    unique: true,
                },
            }
        ],
        customId: {
            type: String,
            required: true,
            unique: true,
        }
    },
    //--
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },

}, { ...schemaModels, toJSON: { virtuals: true }, toObject: { virtuals: true } })




proudctShema.virtual("Reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "productId",
})
export const proudctModel = model("Proudct", proudctShema)