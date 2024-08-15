

import { schemaModels } from './../../src/Utils/index.js';

import mongoose from "../global-setup.js";
import { brandModel } from './index.js';

const { model, Schema, Types } = mongoose

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    ceratedBy: {
        type: Types.ObjectId,
        ref: "User",
    },
    Images: {
        secure_url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
            unique: true,
        },
    },
    customId: {
        type: String,
        required: true,
        unique: true,
    },
    categoryId: {
        type: Types.ObjectId,
        required: true,
        ref: 'Category',
    },
}, {
    ...schemaModels
})




subCategorySchema.post("findOneAndDelete", async function (doc, next) {
    const id = this.getQuery()._id;

    const deleteBrand = await brandModel.deleteMany({
        subCategoryId: id
    })

    if (!deleteBrand.deletedCount) return next(new ErrorApp("Delete in Brand Not Success", 400))


})
export const subCategoryModel = model('SubCategory', subCategorySchema)