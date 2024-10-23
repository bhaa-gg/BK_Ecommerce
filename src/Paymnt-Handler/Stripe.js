
import Stripe from 'stripe';
import { DiscountType } from '../Utils/index.js';



const stripe = new Stripe(process.env.STRAPE_SECRET_KEY);
export const checkOutFun = async ({
    user, amount, address, orderId,
    discounts = []
}) => {

    let customer = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: amount * 100,
                    product_data: {
                        name: user.userName.toString()
                    }
                },
                quantity: 1
            }
        ],// all items i want to buy
        mode: 'payment',
        discounts,
        success_url: process.env.SUCCESS_URL,
        cancel_url: process.env.CANCEL_URL,
        customer_email: user.email.toString(),
        client_reference_id: user._id.toString(),
        metadata: {
            city: address.city.toString(),
            country: address.country.toString(),
            orderId: orderId.toString(),
        }
    });


    return customer;

}

// if order has coupon
export const createStripeCoupon = async (coupon) => {

    let couponObj = {
        name: coupon.couponCode,
    }

    if (coupon.couponType == DiscountType.PERCENTAGE) couponObj.percent_off = coupon.couponAmount;
    if (coupon.couponType == DiscountType.FIXED) couponObj.amount_off = coupon.couponAmount;


    const stripeCoupon = await stripe.coupons.create(couponObj);

    return stripeCoupon


}

// for return PaymentMethod.id in payment Intent 
export const createPaymentMethod = async (token) => {
    const method = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            token,
        }
    })
    return method;
}


// for if user want to return his money and return products
export const createPaymentIntent = async ({ amount, currency }) => {

    const paymentmethod = await createPaymentMethod("tok_visa");
    const intent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never"
        },
        payment_method: paymentmethod.id

    })
    return intent;
}




export const retrivePaymentIntent = async (paymentIntent_id) => await stripe.paymentIntents.retrieve(paymentIntent_id)

export const confirmPaymentIntent = async ({ paymentIntent_id }) => {


    const paymentRetriveIntents = await retrivePaymentIntent(paymentIntent_id)

    const confirmIntents = await stripe.paymentIntents.confirm(paymentIntent_id, {
        payment_method: paymentRetriveIntents.payment_method
    })
    return confirmIntents;
}

export const refundPaymentIntent = async ({ paymentIntent_id }) => await stripe.refunds.create({ payment_intent: paymentIntent_id })