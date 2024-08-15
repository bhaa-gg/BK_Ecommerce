import { schemaModels } from "../../src/Utils/schemaModels.js";

import mongoose from "../global-setup.js";
import { brandModel, subCategoryModel } from "./index.js";
const { model, Schema, Types } = mongoose;

const categorySchema = new Schema({
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
}, {
    ...schemaModels
})





categorySchema.post("findOneAndDelete", async function (doc, next) {
    const id = this.getQuery()._id;
    const deleteSubCategory = await subCategoryModel.deleteMany({
        categoryId: id
    })
    const deleteBrand = await brandModel.deleteMany({
        categoryId: id
    })

    if (!deleteBrand.deletedCount) return next(new ErrorApp("Delete in Brand Not Success", 400))
    if (!deleteSubCategory.deletedCount) return next(new ErrorApp("Delete in SubCategory Not Success", 400))


})


// export const categoryModel = mongoose.model.categoryModel || model("Category", categorySchema)
export const categoryModel = model("Category", categorySchema)


