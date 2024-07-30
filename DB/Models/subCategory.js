

import { schemaModels } from './../../src/Utils/index.js';

import mongoose from "../global-setup.js";

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


export const subCategoryModel = model('SubCategory', subCategorySchema)