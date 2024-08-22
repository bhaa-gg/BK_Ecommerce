import slugify from "slugify";
import { DiscountType } from "./enums.js";




export const calcPrice = (price, discount) => {
    let finalPrice = price
    if (discount.type === DiscountType.PERCENTAGE)
        finalPrice = price - (price * discount.amount) / 100
    else if (discount.type === DiscountType.FIXED)
        finalPrice = price - discount.amount

    return finalPrice
}


export const SlugTitle = (title) => {

    return slugify(title, { lower: true, replacement: "_" });
}