
import { Router } from "express";
import { verifyTokens } from "../../Common/Utils/index.js";
import { authorization, catchErr } from "../../Middlewares/index.js";
import { UserType } from "../../Utils/index.js";
import { addToCart, applyCoupon, removeFromCart, updateCart } from "./cart.controller.js";


const cartRouter = Router();

cartRouter.post("/add/:productId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(addToCart),
)

cartRouter.delete("/rem/:productId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(removeFromCart),
)
cartRouter.put("/edit/:productId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(updateCart),
)


cartRouter.post("/apply",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(applyCoupon),
)

export { cartRouter };

