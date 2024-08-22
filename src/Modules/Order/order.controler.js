import { DateTime } from "luxon"
import { proudctModel, addressesModel, cartModel } from "../../../DB/Models/index.js"
import { orderModel } from "../../../DB/Models/order.js"
import { apiFeaturs, calcPrice, ErrorApp, ordersStatus, paymentMethods } from "../../Utils/index.js"
import { calcSubTotal } from "../Cart/cart.utils.js"
import { couponValidation } from "./Utils/Coupon.js"
import { checkOut } from "../../Common/Utils/checkOut.js"
import Stripe from 'stripe';





export const createOrder = async (req, res, next) => {
    const user = req.authUser
    const { addressId, contactNumber, shippingFee, VAT, couponCode, payMentIntegration } = req.body

    const cart = await cartModel.findOne({ userId: user._id }).populate("products.productId")

    if (!cart || cart.products.length == 0) return next(new ErrorApp("empty cart ", 404))


    const isSoldOut = cart.products.find(p => p.productId.stock < p.quantity)
    if (isSoldOut) return next(new ErrorApp("In cart Product soldOut you can Check It  ", 305))



    const subTotal = await calcSubTotal(cart.products);
    let total = subTotal;
    if (VAT) total += VAT
    if (shippingFee) total += shippingFee
    if (couponCode) {
        const coupon = await couponValidation(couponCode, user._id)
        if (coupon.error) return next(new ErrorApp(coupon.message))
        total = calcPrice(total, { type: coupon.coupon.couponType, amount: coupon.coupon.couponAmount })
    }

    const addressFilters = {}
    if (addressId) {
        addressFilters.userId = user._id
        addressFilters._id = addressId
        addressFilters.isMarkedAsDeleted = false
    }

    if (!addressId) {
        addressFilters.userId = user._id
        addressFilters.isDefault = true
        addressFilters.isMarkedAsDeleted = false
    }


    const myAddress = await addressesModel.findOne(addressFilters);
    if (!myAddress) return next(new ErrorApp("No Address for this user ", 404))


    let orderStatuse = undefined;
    if (payMentIntegration == paymentMethods.Cash) orderStatuse = ordersStatus.Placed


    const orderObject = new orderModel({
        userId: user._id,
        products: cart.products,
        contactNumber,
        addressId: myAddress._id,
        subTotal: total,
        shippingFee,
        VAT,
        couponCode,
        payMentIntegration,
        statusOfOrder: orderStatuse,
        deliveredBy: user._id,
    })


    // const ch = await checkOut(user, total, myAddress).catch(err => next(new ErrorApp(err, 400)));



    // console.log(ch);

    const order = await orderObject.save();

    cart.products = [];
    cart.save();

    res.json({ message: "Success", order: orderObject, ch })

}

export const checkOuts = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRAPE_SECRET_KEY);

    const user = req.authUser;

    const { } = req.body


    let customer = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: 1000 * 100,
                    product_data: {
                        name: user.userName
                    }
                },
                quantity: 1
            }
        ],// all items i want to buy
        mode: 'payment',
        success_url: "https://note-bhaa.netlify.app/",
        cancel_url: "https://note-bhaa.netlify.app/",
        customer_email: "bhaatiti281@gmail.com",
        client_reference_id: user._id,
        metadata: {
            city: "address.city",
            country: "address.country",
        }
    });

    res.json({ messae: "success", e: process.env.STRAPE_SECRET_KEY, customer });
}



export const getUserOrder = async (req, res, next) => {
    const user = req.authUser
    const userOrders = new apiFeaturs(orderModel.find({ userId: user._id }).populate({
        path: "products.productId",
        select: "title Images rating appliedPrice",
    }), req.query).fields()
    // if (!userOrders.length) return next(new ErrorApp("No Orders for this user ", 404))

    const orders = await userOrders.mongoosequery

    return res.json({ message: "Success", orders })
}


export const cancelOrder = async (req, res, next) => {
    const user = req.authUser
    const { orderId } = req.params

    const order = await orderModel.findOne({
        _id: orderId,
        userId: user._id,
        statusOfOrder: { $nin: [ordersStatus.Cancelled, ordersStatus.Placed] },
        deliveryDate: { $gt: DateTime.now() }
    });
    if (!order) return next(new ErrorApp("No Order for this user", 404))

    if (order.deliveryDate <= DateTime.now()) return next(new ErrorApp("Your Order already send", 404))

    order.statusOfOrder = ordersStatus.Cancelled;
    order.cancelledAt = DateTime.now();
    order.cancelledBy = user._id;

    const orderFinal = await order.save();

    return res.json({ message: "Success", order: orderFinal })
}

export const deliverdOrder = async (req, res, next) => {
    const user = req.authUser
    const { orderId } = req.params

    const order = await orderModel.findOne({
        _id: orderId,
        userId: user._id,
        statusOfOrder: { $ne: ordersStatus.Cancelled },
        deliveryDate: { $gt: DateTime.now() }
    });
    if (!order) return next(new ErrorApp("No Order for this user", 404))

    // if (order.deliveryDate > DateTime.now()) return next(new ErrorApp("Your Order not ready now for send", 404))

    order.statusOfOrder = ordersStatus.Placed;
    order.deliveredAt = DateTime.now();
    order.deliveredBy = user._id;

    const orderFinal = await order.save();

    return res.json({ message: "Success", order: orderFinal })
}