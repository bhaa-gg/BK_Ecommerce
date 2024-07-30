import { Router } from "express";
import { extensible } from "../../Utils/index.js";
import { createCategory, deleteCategory, getCategoryById, updateCategory } from "./categories.controller.js";
import { findById, nameExists, catchErr, multerMiddle } from "../../Middlewares/index.js";
import { categoryModel } from "../../../DB/Models/category.js";


const categoryRouter = Router();

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
