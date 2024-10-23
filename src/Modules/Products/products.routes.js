import { Router } from "express";
import { brandModel, proudctModel } from "../../../DB/Models/index.js";
import { extensible } from "../../Utils/index.js";
import { catchErr, checkIfIdsExit, findById, multerMiddle } from './../../Middlewares/index.js';
import { addProducts, deleteProudct, listProducts, updateProduct } from "./products.controller.js";
const productRouter = Router();



productRouter.post("/add",
    catchErr(checkIfIdsExit(brandModel)),
    multerMiddle(extensible.img).array("image", 5),
    catchErr(addProducts)
)


productRouter.put("/update/:id",
    multerMiddle(extensible.img).array("image", 5),
    catchErr(findById(proudctModel)),
    catchErr(updateProduct)
)

productRouter.get("/list",
    catchErr(listProducts)
)

productRouter.delete("/delete/:id",
    catchErr(deleteProudct)
)

export { productRouter };

