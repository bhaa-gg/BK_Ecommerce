import { GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { couponModel, userModel } from "../../../DB/Models/index.js";
import { graphValidationMiddleware, verifyTokensQl } from "../Middlewares/index.js";
import { createCouponCodeQraph } from "../../Modules/CouPon/coupon.schema.js";



export const createCoupon = async (parent, args) => {
    const { couponCode, couponAmount, couponType, from, till, Users, createdBy, myToken } = args

    const tokenV = await verifyTokensQl(myToken, process.env.LOGIN);
    if (!tokenV.user) return new Error(tokenV)


    const notValid = await graphValidationMiddleware(createCouponCodeQraph, { couponCode, couponAmount, couponType, from, till })

    if (notValid !== true) {
        return new Error(JSON.stringify(notValid))
    }

    const co = await couponModel.create({
        couponCode, couponAmount, couponType, from, till, Users, createdBy
    })
    return co


}