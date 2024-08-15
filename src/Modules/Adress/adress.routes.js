
import { Router } from "express";
import { verifyTokens } from "../../Common/Utils/index.js";
import { adressKey, authorization, catchErr } from "../../Middlewares/index.js";
import { UserType } from "../../Utils/index.js";
import { addAddress, deleteAddress, editAddress, getAddress } from "./adress.controller.js";


const addressRouter = Router();


addressRouter.post("/add",

    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(adressKey()),
    catchErr(addAddress),
)

addressRouter.put("/edit/:addressId",

    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(adressKey()),
    catchErr(editAddress),
)

addressRouter.put("/remove/:addressId",

    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    // catchErr(adressKey()),
    catchErr(deleteAddress),
)

addressRouter.get("/",

    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(getAddress),
)


export { addressRouter };

