import { Router } from "express";
import { categoryModel } from "../../../DB/Models/index.js";
import { catchErr, findById, multerMiddle, nameExists } from "../../Middlewares/index.js";
import { extensible } from "../../Utils/index.js";
import { subCategoryRouter } from "../Sub-Categories/sub-categories.routes.js";
import { createCategory, deleteCategory, getCategoryById, updateCategory } from "./categories.controller.js";


const categoryRouter = Router();

categoryRouter.use("/:id/subCategory", subCategoryRouter)


categoryRouter.post("/createCategory",
    multerMiddle(extensible.img).single("image"),
    catchErr(nameExists(categoryModel)),
    catchErr(createCategory)
)



categoryRouter.put("/update/:id",
    multerMiddle(extensible.img).single("image"),
    catchErr(findById(categoryModel)),
    catchErr(nameExists(categoryModel)),
    catchErr(updateCategory)
)


categoryRouter.delete("/delete/:id",
    catchErr(deleteCategory)
)

categoryRouter.get("/getCategoryById",
    catchErr(getCategoryById)
)




export { categoryRouter };

