
import jwt from 'jsonwebtoken';
import { userModel } from '../../../DB/Models/index.js'


export const verifyTokensQl = async (token, SYG) => {


    if (!SYG || !token) new Error("Error Token or Signature", 403);

    let myToken = undefined;
    try {
        myToken = jwt.verify(token, SYG);
    } catch (error) {
        return new Error(error, 403)
    }

    if (!myToken) return new Error("Error No Token Allowed", 403);

    const user = await userModel.findById(myToken.userId);
    if (!user) return new Error("This user does not exist", 404)

    return { user }
}