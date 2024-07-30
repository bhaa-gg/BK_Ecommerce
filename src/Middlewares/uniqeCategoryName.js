import { ErrorApp } from "../Utils/index.js";
import { subCategoryModel } from './../../DB/Models/index.js';

export const nameExists = (model) => {
    return async (req, res, next) => {
        const { name } = req.body;
        if (name) {
            const find = await model.findOne({ name })
            find ? next(new ErrorApp("This Name Already exists", 401)) : next()
        }
    }
}

export const findById = (model) => {
    return async (req, res, next) => {
        let id;
        if (req.params.id) id = req.params.id;
        if (req.body.categoryId) id = req.body.categoryId;
        if (req.query.categoryId) id = req.query.categoryId;



        const find = await model.findById(id);
        if (!find) return next(new ErrorApp("This Id Not Found", 404))
        req.category = find
        return next()
    }
}


export const find_SubCategory_And_CategoryId = async (req, res, next) => {
    const { categoryId, subCategoryId } = req.query

    const find = await subCategoryModel.findOne({ _id: subCategoryId, categoryId }).populate("categoryId");
    if (!find) return next(new ErrorApp("This Id Not Found", 404));
    req.findData = find;
    return next()
}

export const checkIfIdsExit = (model) => {
    return async (req, res, next) => {
        const { category, subCategory, brand } = req.query;

        const theBrand = {};
        if (brand) theBrand._id = brand
        if (subCategory) theBrand.subCategoryId = subCategory
        if (category) theBrand.categoryId = category

        const find = await model.findOne(theBrand).populate([
            { path: "categoryId", select: "customId" },
            { path: "subCategoryId", select: "customId" },
        ]);


        if (!find) return next(new ErrorApp("This Id Not Found", 404));
        req.findData = find;
        return next()
    }
}