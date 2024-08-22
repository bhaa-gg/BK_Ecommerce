import { DateTime } from "luxon";
import { scheduleJob } from "node-schedule";
import { couponModel } from "../../../DB/Models/index.js";



export const disabledExpirationCoupons = async () => {

    const enableCoupon = await couponModel.find({ isEnabled: true })
    if (enableCoupon.length) {
        for (const c of enableCoupon) {
            if (DateTime.now() > DateTime.fromJSDate(c.till)) {
                c.isEnabled = false;
                await c.save();
            }
        }
    }
}

// */5 every 5 seconds
export const disabledExpirationCouponsCrons = async () => {
    scheduleJob('0 59 23 * * *', () => {
        disabledExpirationCoupons();
    }
    )

}