
import { Router } from "express";
import { verifyTokens } from "../../Common/Utils/index.js";
import { authorization, catchErr, validationMiddleware } from "../../Middlewares/index.js";
import { UserType } from "../../Utils/index.js";
import { createCoupons, getCoupons, updateCoupon, updateEnable } from "./coupon.controller.js";
import { createCouponCode, updateCouponCode } from "./coupon.schema.js";


const couponRouter = Router();



couponRouter.post("/add",
    catchErr(validationMiddleware(createCouponCode)),
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(createCoupons),

)

couponRouter.put("/update/:couponId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(validationMiddleware(updateCouponCode)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(updateCoupon),

)

couponRouter.patch("/update/:couponId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(updateEnable),

)

couponRouter.get("/",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(getCoupons),

)

export { couponRouter };

