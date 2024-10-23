import * as Adress from "./Adress/adress.routes.js";
import * as Brand from "./Brand/brands.routes.js";
import * as Cart from "./Cart/cart.routes.js";
import * as Categories from "./Categories/categories.routes.js";
import * as CouPon from "./CouPon/coupon.routes.js";
import * as Order from "./Order/order.routes.js";
import * as Products from "./Products/products.routes.js";
import * as Sub from "./Sub-Categories/sub-categories.routes.js";
import * as User from "./User/user.routes.js";
import * as Reviews from "./Reviews/review.routes.js";
import cors from "cors";
import { globalResponse } from "../Middlewares/CatchError.middleware.js";
import { ErrorApp } from "../Utils/index.js";



export const    routesConnection = (app, express) => {
    app.use(cors())
    app.use(express.json())
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use("/address", Adress.addressRouter)
    app.use("/review", Reviews.reviewRouter)
    app.use("/order", Order.orderRouter)
    app.use("/cart", Cart.cartRouter)
    app.use("/coupon", CouPon.couponRouter)
    app.use("/brand", Brand.brandRouter)
    app.use("/category", Categories.categoryRouter)
    app.use("/subCategory", Sub.subCategoryRouter)
    app.use("/product", Products.productRouter)
    app.use("/user", User.userRouter)

    app.use("*", (req, res, next) => next(new ErrorApp("Page not found", 404, "Not Found")))

    app.use(globalResponse)

};
