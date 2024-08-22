import { ChangesCouponModel, couponModel, userModel } from "../../../DB/Models/index.js";
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


export const updateCoupon = async (req, res) => {
    const { couponId } = req.params
    const user = req.authUser

    const { couponCode, couponAmount, couponType, from, till, Users } = req.body


    const coupon = await couponModel.findById(couponId)

    if (!coupon) return next(new ErrorApp("Couldn't find coupon", 404))

    const changesInCoupons = { couponId, updatedBy: user._id, changes: {} }
    if (couponCode) {
        const couponCodeExists = await couponModel.findOne({ couponCode });
        if (couponCodeExists) return next(new ErrorApp("coupon Exists", 401))
        coupon.couponCode = couponCode
        changesInCoupons.changes.couponCode = couponCode
    }

    if (couponAmount) {
        coupon.couponAmount = couponAmount
        changesInCoupons.changes.couponAmount = couponAmount
    }
    if (couponType) {
        coupon.couponType = couponType
        changesInCoupons.changes.couponType = couponType
    }
    if (from) {
        coupon.from = from
        changesInCoupons.changes.from = from
    }
    if (till) {
        coupon.till = till
        changesInCoupons.changes.till = till
    }

    if (Users) {
        const userIdFilters = Users.map(u => u.userId)
        const usersExists = await userModel.find({ _id: { $in: userIdFilters } })
        if (usersExists.length != Users.length || !usersExists) return next(new ErrorApp("InValid Users Ids", 400))
        coupon.Users = Users
        changesInCoupons.changes.Users = Users
    }


    const myCoupon = await coupon.save()
    const log = await new ChangesCouponModel(changesInCoupons).save()

    res.json({ message: "Coupon updated successfully", myCoupon, log })


}

export const updateEnable = async (req, res, next) => {
    const { couponId } = req.params
    const user = req.authUser

    const { enabled } = req.body

    if (!enabled && (enabled !== false) && (enabled !== true))
        return next(new ErrorApp("Enable Required", 402))

    const coupon = await couponModel.findById(couponId)

    if (!coupon) return next(new ErrorApp("Couldn't find coupon", 404))

    const changesInCoupons = { couponId, updatedBy: user._id, changes: {} }

    coupon.isEnabled = enabled === true ? true : false
    changesInCoupons.changes.isEnabled = enabled === true ? true : false


    const myCoupon = await coupon.save()
    const log = await new ChangesCouponModel(changesInCoupons).save()

    res.json({ message: "Coupon updated successfully", myCoupon, log })
}

export const getCoupons = async (req, res, next) => {
    const isEnabled = req.query
    const filters = {}
    if (isEnabled) filters.isEnabled = isEnabled === "true" ? true : false
    const theCoupons = await couponModel.find(filters)
    res.status(200).json({ message: "Success", theCoupons })

}