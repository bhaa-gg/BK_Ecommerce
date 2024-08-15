import { Router } from "express";
import { categoryModel, subCategoryModel } from "../../../DB/Models/index.js";
import { catchErr, findById, multerMiddle, nameExists } from "../../Middlewares/index.js";
import { extensible } from "../../Utils/index.js";
import { createSubCategory, deleteSubCategory, getSubCategory, updateSubCategory } from "./sub-categories.controller.js";
const subCategoryRouter = Router({ mergeParams: true });



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

subCategoryRouter.get("/",
    catchErr(getSubCategory)
)

subCategoryRouter.get("/:id",
    catchErr(getSubCategory)
)


export { subCategoryRouter };

