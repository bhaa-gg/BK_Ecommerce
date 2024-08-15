


import { calcSubTotal } from '../../src/Modules/Cart/cart.utils.js';
import { schemaModels } from '../../src/Utils/index.js';
import mongoose from "../global-setup.js";
const ObjectId = mongoose.Types.ObjectId;

const { model, Schema, Types } = mongoose;

const cartSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Proudct",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ],

    subTotal: Number

}, {
    ...schemaModels
})

cartSchema.pre("save", function (next) {

    if (this.products.length > 0) {
        this.subTotal = calcSubTotal(this.products);
    }
    next();
})

export const cartModel = model('Cart', cartSchema)