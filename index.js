import { config } from 'dotenv'
config()

import express from 'express'
import { dbConnection } from './DB/Connection.js'
import { globalResponse } from './src/Middlewares/CatchError.middleware.js'
import * as routes from "./src/Modules/index.js"
import { ErrorApp } from './src/Utils/ErrorApp.js'

const app = express()
const port = process.env.PORT




app.use(express.json())
app.use("/address", routes.addressRouter)
app.use("/cart", routes.cartRouter)
app.use("/coupon", routes.couponRouter)
app.use("/brand", routes.brandRouter)
app.use("/category", routes.categoryRouter)
app.use("/subCategory", routes.subCategoryRouter)
app.use("/product", routes.productRouter)
app.use("/user", routes.userRouter)



dbConnection()

app.get('/', (req, res) => res.send('Hello World!'))
app.use("*", (req, res, next) => next(new ErrorApp("Page not found", 404, "Not Found")))
app.use(globalResponse)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))