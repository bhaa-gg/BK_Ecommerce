
import { Router } from "express";
import { userModel } from "../../../DB/Models/index.js";
import { authorization, catchErr, findById, findByMail } from "../../Middlewares/index.js";
import { UserType } from "../../Utils/enums.js";
import { allUsers, changeUserPassword, deleteUser, getUser, login, registerUser, updateOneUser, updateUser, verifyMail } from "./user.controller.js";


const userRouter = Router();


userRouter.post("/",
    catchErr(findByMail(userModel)),
    catchErr(registerUser)
)

userRouter.post("/login",
    catchErr(login)
)

userRouter.get("/",
    catchErr(allUsers)
)






userRouter.get("/verifyMail/verifyMail",
    catchErr(verifyMail)
)


userRouter.patch("update/:id",
    catchErr(findById(userModel)),
    catchErr(findByMail(userModel)),
    catchErr(updateOneUser)
)

userRouter.put("/changeUserPassword",

    catchErr(authorization([UserType.Buyer])),
    catchErr(changeUserPassword)
)


userRouter.get("get/:id",
    catchErr(getUser)
)
userRouter.delete("del/:id",
    catchErr(deleteUser)
)

userRouter.put("updatee/:id",
    catchErr(findById(userModel)),
    catchErr(findByMail(userModel)),
    catchErr(updateUser)
)

export { userRouter };

