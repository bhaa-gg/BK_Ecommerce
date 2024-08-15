
import { Router } from "express";
import { verifyTokens } from "../../Common/Utils/index.js";
import { authorization, catchErr, validationMiddleware } from "../../Middlewares/index.js";
import { UserType } from "../../Utils/index.js";
import { createCoupons } from "./coupon.controller.js";
import { createCouponCode } from "./coupon.schema.js";


const couponRouter = Router();



couponRouter.post("/add",
    catchErr(validationMiddleware(createCouponCode)),
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(createCoupons),

)

export { couponRouter };

