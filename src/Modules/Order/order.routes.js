import { Router } from "express";
import { verifyTokens } from "../../Common/Utils/verifyToken.js";
import { authorization, catchErr } from "../../Middlewares/index.js";
import { UserType } from "../../Utils/index.js";
import { cancelOrder, checkOuts, createOrder, deliverdOrder, getUserOrder } from "./order.controler.js";
const orderRouter = Router();



orderRouter.post("/new",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(createOrder)
)

orderRouter.get("/myOrders",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(getUserOrder)
)

orderRouter.put("/cancelOrder/:orderId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(cancelOrder)
)

orderRouter.patch("/cancelOrder/:orderId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(deliverdOrder)
)
orderRouter.post("/ch",
    // catchErr(verifyTokens(process.env.LOGIN)),
    // catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(checkOuts)
)

export { orderRouter };

