
import { config } from 'dotenv'
import express from 'express'
import { dbConnection } from './DB/Connection.js'
import * as routes from "./src/Modules/index.js"
import { socketConnection } from './src/Common/Utils/Socket.utils.js'
import { disabledExpirationCoupons } from './src/Common/Utils/cron.js'
import { createHandler } from 'graphql-http/lib/use/express'
import { schema } from './src/GraphQl/index.js';



export const main = async () => {


    config()
    const app = express()
    const port = process.env.PORT || 3000




    app.use('/graphql', createHandler({ schema }));

    routes.routesConnection(app, express)
    dbConnection()

    disabledExpirationCoupons()
    const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    const io = socketConnection(server);
    io.on("connection", (socket) => {
        console.log("user connected");
    })
}