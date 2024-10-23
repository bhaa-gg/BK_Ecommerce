import Joi from "joi";
import { DateTime } from "luxon";
import { DiscountType, generalRules } from "../../Utils/index.js";



export const createCouponCodeQraph = Joi.object({
    couponCode: Joi.string().required(),
    couponType: Joi.string().valid(...Object.values(DiscountType)).required(),
    couponAmount: Joi.number().when("couponType",
        {
            is: Joi.string().valid(DiscountType.PERCENTAGE),
            then: Joi.number().max(100).required(),
        }
    ).required().min(1).message({
        "number.min": "must be greater than 0",
        "number.max": "must be less than 100",
    }),
    from: Joi.date().greater(Date.now()).required(),
    till: Joi.date().greater(Joi.ref("from")).required(),


})

export const createCouponCode = {
    body: Joi.object({
        couponCode: Joi.string().required(),
        couponType: Joi.string().valid(...Object.values(DiscountType)).required(),
        couponAmount: Joi.number().when("couponType",
            {
                is: Joi.string().valid(DiscountType.PERCENTAGE),
                then: Joi.number().max(100).required(),
            }
        ).required().min(1).message({
            "number.min": "must be greater than 0",
            "number.max": "must be less than 100",
        }),
        from: Joi.date().greater(Date.now()).required(),
        till: Joi.date().greater(Joi.ref("from")).required(),
        Users: Joi.array().items(Joi.object({
            userId: generalRules._ids.required(),
            maxCount: Joi.number().min(1).required(),
        }))
    }),
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.my_headers
    })
}


export const updateCouponCode = {
    body: Joi.object({
        couponCode: Joi.string().optional(),
        couponType: Joi.string().valid(...Object.values(DiscountType)).optional(),
        couponAmount: Joi.number().when("couponType",
            {
                is: Joi.string().valid(DiscountType.PERCENTAGE),
                then: Joi.number().max(100).optional(),
            }
        ).optional().min(1).message({
            "number.min": "must be greater than 0",
            "number.max": "must be less than 100",
        }),
        from: Joi.date().greater(DateTime.now()?.minus({ days: 1 })).optional(),
        till: Joi.date().greater(Joi.ref("from")).optional(),
        Users: Joi.array().items(Joi.object({
            userId: generalRules._ids.optional(),
            maxCount: Joi.number().min(1).optional(),
        }))
    }),
    headers: Joi.object({
        token: Joi.string().required(),
        ...generalRules.my_headers
    }),
    params: Joi.object({
        couponId: generalRules._ids.required(),
    }),
    // authUser: Joi.object({
    //     "_id": generalRules._ids.optional(),
    // }).options({ allowUnknown: true })
}