import { ErrorApp } from "../Utils/index.js"



export const catchErr = (fn) => {
    return (req, res, next) => {
        fn(req, res, next)?.catch(err => next(new ErrorApp("Internal Server error", 400, err.stack)))
    }
}


export const globalResponse = (err, req, res, next) => {
    if (err) {
        let errMsg = err.message || "Server error"
        let statusCode = err.statusCode || 500
        let stack = err.stack || err.message
        res.status(statusCode).json({ message: "fail response", errMsg, stack })
    }
}