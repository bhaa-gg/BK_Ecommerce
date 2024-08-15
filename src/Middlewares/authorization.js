import { ErrorApp } from "../Utils/index.js";



export const authorization = (allowedRole) => {
    return async (req, res, next) => {


        if (!allowedRole.includes(req.authUser.userType))
            return next(new ErrorApp("not allowed this role", 300))

        next()
    }
}