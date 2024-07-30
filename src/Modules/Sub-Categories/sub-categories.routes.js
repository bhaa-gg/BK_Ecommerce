import { Router } from "express";
import { catchErr, findById, multerMiddle, nameExists } from "../../Middlewares/index.js";
import { createSubCategory, deleteSubCategory, getSubCategory, updateSubCategory } from "./sub-categories.controller.js";
import { extensible } from "../../Utils/index.js";
import { subCategoryModel, categoryModel } from "../../../DB/Models/index.js";
const subCategoryRouter = Router();



subCategoryRouter.post("/create",
    multerMiddle(extensible.img).single("image"),
    catchErr(nameExists(categoryModel)),
    catchErr(findById(categoryModel)),
    catchErr(createSubCategory)

)

subCategoryRouter.put("/updateSubCategory/:id",
    multerMiddle(extensible.img).single("image"),
    catchErr(nameExists(subCategoryModel)),
    catchErr(findById(subCategoryModel)),
    catchErr(updateSubCategory)

)

subCategoryRouter.delete("/deleteSubCategory/:id",
    catchErr(deleteSubCategory)

)

subCategoryRouter.get("/getSubCategory",
    catchErr(getSubCategory)
)


export { subCategoryRouter };
