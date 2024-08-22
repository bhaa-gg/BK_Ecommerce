import { DateTime } from "luxon";
import { couponModel } from "../../../../DB/Models/index.js";



export const couponValidation2 = async (coupon, userId) => {

    const theCoupon = await couponModel.findOne({ couponCode: coupon, "Users.userId": userId }, { 'Users.$': 1 }).select("isEnabled till from couponType  couponAmount ")
    if (!theCoupon) return { message: "invalid Coupon Code or user not have this Coupon", error: true }

    const nows = DateTime.now();

    if (!theCoupon.isEnabled || nows > DateTime.fromJSDate(theCoupon.till) || !(nows <= DateTime.fromJSDate(theCoupon.from))) return { message: "Coupon Code not  Enabled Now", error: true }

    const isUserGood = theCoupon.Users.at(0).usageCount > theCoupon.Users.at(0).maxCount;
    if (isUserGood) return { message: "Usages Full for this User", error: true }

    return { error: false, theCoupon }
}



export const couponValidation = async (couponCode, userId) => {

    const coupon = await couponModel.findOne({
        couponCode: couponCode,
        isEnabled: true,
        till: { $gte: DateTime.now() },
        from: { $lte: DateTime.now() },
        "Users.userId": userId
    }
        , { 'Users.$': 1 }
    ).select("isEnabled till from couponType  couponAmount ")


    if (!coupon) return { message: "invalid Coupon Code or user not have this Coupon", error: true }

    const isUserGood = coupon.Users.at(0).usageCount < coupon.Users.at(0).maxCount;
    if (!isUserGood) return { message: "Usages Full for this User", error: true }


    return { error: false, coupon }
}


