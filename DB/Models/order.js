


import { DateTime } from 'luxon';
import { ordersStatus, paymentMethods, schemaModels } from '../../src/Utils/index.js';
import mongoose from "../global-setup.js";
import { couponModel } from './coupon.js';
import { proudctModel } from './product.js';

const { model, Schema, Types } = mongoose;

const orderSchema = new Schema({

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

    fromCart: {
        type: Boolean,
        default: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    addressId: {
        type: Schema.Types.ObjectId,
        ref: "Address"
    },
    subTotal: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    VAT: {
        type: Number,
        required: true,
    },
    couponId: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
    },
    deliveryDate: {
        type: Date,
        default: DateTime.now().plus({ days: 3 })
    },
    payMentIntegration: {
        type: String,
        enum: Object.values(paymentMethods)
    },
    statusOfOrder: {
        type: String,
        required: true,
        enum: Object.values(ordersStatus),
        default: ordersStatus.Pending,
    },
    deliveredBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    deliveredAt: Date,
    cancelledAt: Date,
    payment_intent: String,

}, {
    ...schemaModels
})



orderSchema.post("save", async function (doc, next) {
    if (doc.payment_intent && (doc.statusOfOrder == ordersStatus.Pending || doc.statusOfOrder == ordersStatus.Refunded)) return;

    if (doc.products.length && doc.statusOfOrder != ordersStatus.Cancelled && doc.statusOfOrder != ordersStatus.Delivered) {

        for (const p of doc.products) {
            await proudctModel.updateOne({ _id: p.productId }, { $inc: { stock: -p.quantity } })
        }
    }
    if (doc.couponCode && doc.statusOfOrder != ordersStatus.Cancelled && doc.statusOfOrder != ordersStatus.Delivered) {
        console.log("update_usageCouponCount_AfterOrder");
        await couponModel.updateOne(
            { couponCode: doc.couponCode, "Users.userId": doc.userId },
            { $inc: { "Users.$.usageCount": 1 } }
        );
    }
    if (doc.statusOfOrder == ordersStatus.Cancelled) {
        console.log("update_ProductsCount_AfterCanceledOrder");

        for (const p of doc.products) {
            await proudctModel.updateOne({ _id: p.productId }, { $inc: { stock: p.quantity } })
        }
    }
    next();

})
export const orderModel = model('Order', orderSchema)

