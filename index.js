import express from 'express'
import { globalResponse } from './src/Middlewares/CatchError.middleware.js'
import { config } from 'dotenv'
import { ErrorApp } from './src/Utils/ErrorApp.js'
import { dbConnection } from './DB/Connection.js'
import * as routes from "./src/Modules/index.js"

config()
const app = express()
const port = process.env.PORT
app.use(express.json())
app.use("/brand", routes.brandRouter)
app.use("/category", routes.categoryRouter)
app.use("/subCategory", routes.subCategoryRouter)
app.use("/product", routes.productRouter)

dbConnection()
app.get('/', (req, res) => res.send('Hello World!'))
app.use("*", (req, res, next) => next(new ErrorApp("Page not found", 404, "Not Found")))
app.use(globalResponse)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))