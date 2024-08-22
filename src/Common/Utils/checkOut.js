
import Stripe from 'stripe';



export const checkOut = async (user, amount, address) => {
    const stripe = new Stripe(process.env.STRAPE_SECRET_KEY);

    let customer = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: amount * 100,
                    product_data: {
                        name: "user.userName"
                    }
                },
                quantity: 1
            }
        ],// all items i want to buy
        mode: 'payment',
        success_url: "https://note-bhaa.netlify.app/",
        cancel_url: "https://note-bhaa.netlify.app/",
        customer_email: "bhaatiti281@gmail.com",
        client_reference_id: "user._id",
        metadata: {
            city: "address.city",
            country: "address.country",
        }
    });

    console.log(customer);

    return customer;

}