import { proudctModel } from "../../../DB/Models/index.js";



export const checkProductStock = async (productId, quantity) => await proudctModel.findOne({ productId, stock: { $gte: quantity } })


export const calcSubTotal = async (products) => {

    let total = 0
    products.forEach(e => {
        total += e.price * e.quantity
    })
    return total;

}