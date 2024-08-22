import { Router } from "express";
import { authorization, catchErr } from "../../Middlewares/index.js";
import { verifyTokens } from "../../Common/Utils/index.js";
import { addReview, listReviews, reactInReviews } from "./review.controller.js";
import { UserType } from "../../Utils/index.js";


const reviewRouter = Router();

reviewRouter.post("/add",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(addReview),

)

reviewRouter.get("/reviews",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(listReviews),

)
reviewRouter.put("/edit/:reviewId",
    catchErr(verifyTokens(process.env.LOGIN)),
    catchErr(authorization([UserType.Buyer, UserType.USER])),
    catchErr(reactInReviews),
)


export { reviewRouter };

