
import jwt from 'jsonwebtoken';

import { userModel } from "../../DB/Models/index.js";
import { ErrorApp } from '../Utils/ErrorApp.js';

export const verifyToken = (SYG) => {
    return (req, res, next) => {

        let theToken;

        if (req.query.userId) theToken = req.query.userId;
        else if (req.headers.token) theToken = req.headers.token;


        if (!theToken) return next(new ErrorApp("Token should be here", 404));
        jwt.verify(theToken, SYG, async (err, data) => {

            if (err) return next(new ErrorApp(err, 404));

            const theUser = await userModel.findById(data.userId)

            if (!theUser) return next(new ErrorApp("This user Id Not Found", 404));

            req.user = theUser;

            next()
        })

    }
}
