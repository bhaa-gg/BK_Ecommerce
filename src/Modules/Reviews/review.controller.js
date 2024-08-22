import { orderModel } from "../../../DB/Models/order.js";
import { ErrorApp, ordersStatus, ReviewStatus } from "../../Utils/index.js";
import { proudctModel, reviewModel } from './../../../DB/Models/index.js';



export const addReview = async (req, res, next) => {
  const user = req.authUser;
  const { productId, reviewRating, reviewBody } = req.body;

  const reviewProduct = await reviewModel.findOne({ productId, userId: user._id });
  if (reviewProduct) return next(new ErrorApp("You can only add one review per product", 400));


  const productInOrder = await orderModel.findOne({ userId: user._id, "products.productId": productId, statusOfOrder: ordersStatus.Placed }, { "products.$": 1 });
  if (!productInOrder) return next(new ErrorApp("Product not in order", 404));

  const review = await new reviewModel({
    userId: user._id,
    productId,
    reviewRating,
    reviewBody,
  }).save();

  res.json({ message: "Review added successfully", review });
}


export const listReviews = async (req, res, next) => {
  const user = req.authUser;
  const reviews = await reviewModel.find({ userId: user._id }).populate(
    [{
      path: "userId",
      select: "userName email -_id"
    },
    {
      path: "productId",
      select: "title rating appliedPrice -_id"
    },]
  );

  if (!reviews) return next(new ErrorApp("No reviews for this user", 404));

  res.json({ message: "success", reviews });
}


export const reactInReviews = async (req, res, next) => {
  const user = req.authUser;
  const { reviewId } = req.params;
  const { react = true } = req.body;

  const check = {}
  if (react !== false || react !== true)
    check.reviewStatus = false;

  check.reviewStatus = react === true ? ReviewStatus.Approved : ReviewStatus.Refunded;


  const review = await reviewModel.findOneAndUpdate({ _id: reviewId, userId: user._id }, check, { new: true });

  if (!review) return next(new ErrorApp("No review for this user", 404));

  return res.json({ message: "success", review });
}