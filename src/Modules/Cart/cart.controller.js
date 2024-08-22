import { cartModel } from "../../../DB/Models/index.js";
import { calcPrice, ErrorApp } from "../../Utils/index.js";
import { calcSubTotal, checkProductStock } from "./cart.utils.js";
import { couponModel } from './../../../DB/Models/index.js';
import { DateTime } from "luxon";
import { couponValidation } from "../Order/Utils/Coupon.js";



export const addToCart = async (req, res, next) => {

  const user = req.authUser;
  const { productId } = req.params;
  const { quantity = 1 } = req.body;


  const theProduct = await checkProductStock(productId, quantity)


  if (!theProduct) return next(new ErrorApp("Product not Available", 404))

  const theCart = await cartModel.findOne({ userId: user._id })

  if (!theCart) {
    const newCart = new cartModel({
      userId: user._id,
      products: [
        {
          productId: theProduct._id,
          quantity,
          price: theProduct.appliedPrice,
        }
      ],
    })

    await newCart.save()
    return res.json({ message: "Success", cart: newCart })
  }

  const isProductExist = theCart.products.find(p => p.productId == productId)

  if (isProductExist) return next(new ErrorApp("Product in Cart already", 404))

  theCart.products.push({
    productId: theProduct._id,
    quantity,
    price: theProduct.appliedPrice,
  })


  await theCart.save()
  res.json({ message: "Success", cart: theCart })


}


export const removeFromCart = async (req, res, next) => {
  const user = req.authUser

  const { productId } = req.params;


  const cart = await cartModel.findOne({ userId: user._id, "products.productId": productId })

  if (!cart) return next(new ErrorApp("Product not in cart"))


  cart.products = cart.products.filter(p => p.productId != productId);

  await cart.save();

  res.status(200).json({ message: "Removed product successfully", cart })
}

export const updateCart = async (req, res, next) => {

  const user = req.authUser
  const { quantity = 1 } = req.body;
  const { productId } = req.params;
  if (!quantity) quantity = 1;



  const cart = await cartModel.findOne({ userId: user._id, "products.productId": productId })

  const theProduct = await checkProductStock(productId, quantity)


  if (!cart || !theProduct) return next(new ErrorApp("Product not in cart or not available"))



  const theProud = cart.products.findIndex(p => p.productId == productId)

  cart.products.at(theProud).quantity = quantity



  res.status(200).json({ message: "update successfully", cart })
}



export const getCart = async (req, res, next) => {


  const user = req.authUser

  const cart = await cartModel.findOne({ userId: user._id, })

  if (!cart) return next(new ErrorApp("No Cart for this user", 404));

  res.status(200).json({ message: " success", cart })




}





export const applyCoupon = async (req, res, next) => {

  const user = req.authUser

  const cart = await cartModel.findOne({ userId: user._id })
  if (!cart) return next(new ErrorApp("No Cart For this User", 404))

  if (!req.body.couponCode) return next(new ErrorApp(" Your Coupon Code is Empty", 404))

  const coupon = await couponValidation(req.body.couponCode, user._id)
  if (coupon.error) return next(new ErrorApp(coupon.message))

  const subTotal = await calcSubTotal(cart.products);

  const total = calcPrice(subTotal, { type: coupon.coupon.couponType, amount: coupon.coupon.couponAmount })



  return res.json({ subTotal, total, dis: subTotal - total })
}