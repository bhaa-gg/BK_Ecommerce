import mongoose from "../global-setup.js";
import { schemaModels } from './../../src/Utils/index.js';

const { model, Schema, Types } = mongoose;

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
    logo: {
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
    subCategoryId: {
        type: Types.ObjectId,
        required: true,
        ref: 'SubCategory',
    },
}, {
    ...schemaModels
})


export const brandModel = model('Brand', brandSchema)