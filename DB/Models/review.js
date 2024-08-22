


import { DateTime } from 'luxon';
import mongoose from "../global-setup.js";
import { ReviewStatus, schemaModels } from '../../src/Utils/index.js';
import { proudctModel } from './product.js';

const { model, Schema, Types } = mongoose;

const reviewSchema = new Schema({

    userId: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
    },
    productId: {
        type: Types.ObjectId,
        required: true,
        ref: "Proudct",
    },
    reviewRating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewBody: String,
    reviewStatus: {
        type: String,
        enum: Object.values(ReviewStatus),
        default: ReviewStatus.Pending
    },
    reviewDate: {
        type: Date,
        default: DateTime.now(),
    },
    actionDoneBy: {
        type: Types.ObjectId,
        ref: "User",
    }

}, {
    ...schemaModels
})

reviewSchema.post("save", async function (doc, next) {

    if (doc.reviewStatus == ReviewStatus.Pending && doc.reviewBody) {
        const reviews = await reviewModel.find({ productId: doc.productId });
        const sumRate = reviews.reduce((sum, r) => sum + r.reviewRating, 0) / reviews.length;
        await proudctModel.updateOne({ _id: doc.productId }, { rating: sumRate })
    }
    next();
})




export const reviewModel = model('Review', reviewSchema)

