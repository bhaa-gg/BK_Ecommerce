import mongoose from "../../DB/global-setup.js";
import { ErrorApp } from "../Utils/index.js";
import { addressesModel, subCategoryModel } from './../../DB/Models/index.js';

export const nameExists = (model) => {
    return async (req, res, next) => {
        const { name } = req.body;
        if (name) {
            const find = await model.findOne({ name: name })
            if (find)
                next(new ErrorApp("This Name Already exists", 401))
        }
        next()
    }
}

export const findById = (model) => {
    return async (req, res, next) => {
        let id;
        if (req.params.id) id = req.params.id;
        if (req.body.categoryId) id = req.body.categoryId;
        if (req.query.categoryId) id = req.query.categoryId;
        if (req.authUser) id = req.authUser._id;


        const find = await model.findById(id);
        if (!find) return next(new ErrorApp("This Id Not Found in " + mongoose.modelNames(model), 404))
        req.category = find
        return next()
    }
}

export const findByMail = (model) => {
    return async (req, res, next) => {
        let finders = {};

        if (req.body.email) {

            finders.email = req.body.email
            const find = await model.findOne(finders);
            if (find) return next(new ErrorApp("This Mail Exists ", 401))
        }

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


export const adressKey = () => {
    return async (req, res, next) => {
        const {
            country, city, buildingNumber, postalCode, floorNumber,
        } = req.body
        const findAdd = await addressesModel.findOne({ userId: req.authUser._id, country, city, buildingNumber, postalCode, floorNumber })
        if (findAdd) return next(new ErrorApp("this address already exists for this user ", 402));
        next();
    }
}