import { Router } from "express";
import { extensible } from "../../Utils/index.js";
import { brandModel } from './../../../DB/Models/index.js';
import { catchErr, find_SubCategory_And_CategoryId, findById, multerMiddle, nameExists } from './../../Middlewares/index.js';
import { createBrand, deleteBrand, getBrand, updateBrand } from "./brands.controller.js";

const brandRouter = Router();





brandRouter.post("/createBrand",
    multerMiddle(extensible.img).single("image"),
    // catchErr(nameExists(brandModel)),
    catchErr(find_SubCategory_And_CategoryId),
    catchErr(createBrand),
)

brandRouter.put("/updateBrand/:id",
    multerMiddle(extensible.img).single("image"),
    catchErr(nameExists(brandModel)),
    catchErr(findById(brandModel)),
    catchErr(updateBrand),
)
brandRouter.delete("/deleteBrand/:id",
    catchErr(deleteBrand),
)
brandRouter.get("/getBrand",
    catchErr(getBrand),
)

export { brandRouter };

