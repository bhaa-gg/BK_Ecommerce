import { couponModel, userModel } from "../../../DB/Models/index.js";
import { ErrorApp } from "../../Utils/index.js";



export const createCoupons = async (req, res, next) => {
    const { couponCode, couponAmount, couponType, from, till, Users } = req.body

    const couponExists = await couponModel.findOne({ couponCode })
    if (couponExists) return next(new ErrorApp("Coupon already exists", 400))

    const userIdFilters = Users.map(u => u.userId)

    const usersExists = await userModel.find({ _id: { $in: userIdFilters } })

    if (usersExists.length != Users.length || !usersExists) return next(new ErrorApp("InValid Users Ids", 400))

    const Coupon = new couponModel({
        couponCode, couponAmount, couponType, from, till, Users, createdBy: req.authUser._id
    })

    await Coupon.save();


    res.json({ message: "Coupon Created", Coupon })
}