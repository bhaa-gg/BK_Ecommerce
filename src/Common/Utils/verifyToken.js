
import jwt from 'jsonwebtoken';
import { userModel } from '../../../DB/Models/index.js';
import { ErrorApp } from '../../Utils/index.js';

import { OAuth2Client } from 'google-auth-library';




export const MakeJwt = (userData, SYG) => {

    const returndValue = {};

    if (!userData || !SYG) {
        returndValue.error = "Error user Data or Signature";
        return returndValue;
    }

    try {
        returndValue.token = jwt.sign(userData, SYG)
    } catch (error) {
        returndValue.error = error;
        return returndValue
    }

    return returndValue;

}


export async function verifyGoogle(token) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return { payload, userid };
}


export const verifyTokens = (SYG) => {

    return async (req, res, next) => {

        let myToken;
        let token;
        if (req.headers.token) token = req.headers.token
        if (req.query.userId) token = req.query.userId

        if (!SYG || !token) return next(new ErrorApp("Error Token or Signature", 403));

        try {
            myToken = jwt.verify(token, SYG);
        } catch (error) {
            return next(new ErrorApp(error, 403))
        }

        if (!myToken) return next(new ErrorApp("Error No Token Allowed", 403));


        const user = await userModel.findById(myToken.userId);

        if (!user) return next(new ErrorApp("This user does not exist", 404))


        req.authUser = user
        next();
    }


}