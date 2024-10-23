
import { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addressesModel, userModel } from '../../../DB/Models/index.js';
import { MakeJwt, verifyGoogle } from '../../Common/Utils/index.js';
import { sendMail } from '../../Services/index.js';
import { apiFeaturs, ErrorApp, UserProviders } from '../../Utils/index.js';
import { nanoid } from 'nanoid';



export const registerUser = async (req, res, next) => {

  const { userName, email, password, age, userType, gender
    , country
    , city
    , postalCode
    , buildingNumber
    , floorNumber
    , addressLabel
  } = req.body;

  const newUser = new userModel({
    userName, email, password, age, userType, gender,
  })

  const addressInstances = new addressesModel({
    addressLabel, userId: newUser._id, country, city, postalCode, buildingNumber, floorNumber, isDefault: true
  })



  const myToken = MakeJwt({ userId: newUser._id }, process.env.CONFIRMED_MAIL)

  if (myToken.error) return next(new ErrorApp(User.error, 400))


  const confirmedLink = `${req.protocol}://${req.headers.host}/user/verifyMail/verifyMail?userId=${myToken.token}`


  const senedeMail = await sendMail({
    to: email,
    subject: `Econmmerce Application `,
    text: `Hello ${userName}`,
    tokenLink: confirmedLink,
    myHost: req.headers.host,
  })

  console.log("befox  senedeMail ");
  if (senedeMail.rejected.length) return next(new ErrorApp("Error email sending", 500))

  console.log("after  senedeMail ");

  const savedUser = await newUser.save()
  const savedAddress = await addressInstances.save()

  res.status(201).json({ message: "Success", savedUser, savedAddress })


}


export const verifyMail = async (req, res, next) => {




  const user = req.authUser

  const updateConfirmedMail = await userModel.updateOne({ _id: user._id }, { isEmailVerified: true })


  res.status(200).json({ message: "Verified Success", updateConfirmedMail })

}


export const login = async (req, res, next) => {

  const user = await userModel.findOne({ email: req.body.email })

  if (!user || !compareSync(req.body.password, user.password)) return next(new ErrorApp("Check your password or Mail", 300))

  jwt.sign(
    {
      userId: user._id,
      userName: user.userName,
      email: user.email,
      password: user.password,
    }, process.env.LOGIN, (err, data) => {
      if (err) return next(new ErrorApp(err, 400))
      res.json({ user, token: data })
    })
}

export const allUsers = async (req, res, next) => {

  const findClass = new apiFeaturs(userModel.find(), req.query).paginataion()

  const find = await findClass.mongoosequery;

  res.status(200).json({ message: "Success", find })

}

export const getUser = async (req, res, next) => {

  let _id = req.params.id || req.user._id

  const theUser = await userModel.findById(_id);

  res.status(200).json({ message: "Success", theUser })

}

export const updateUser = async (req, res, next) => {

  const document = req.category

  if (req.body.userName)
    document.userName = req.body.userName

  if (req.body.password)
    document.password = req.body.password

  if (req.body.email)
    document.email = req.body.email

  if (req.body.age)
    document.age = req.body.age



  const updated_User = await document.save()

  res.status(200).json({ message: "Update Success", updated_User })
}

export const updateOneUser = async (req, res, next) => {

  const document = {}

  if (req.body.userName)
    document.userName = req.body.userName

  if (req.body.password)
    document.password = req.body.password

  if (req.body.email)
    document.email = req.body.email

  if (req.body.age)
    document.age = req.body.age


  // const theUser = new userModel({ _id: req.params.id })

  // const updateds_User = await theUser.updateOne({ _id: req.params.id }, document)


  const updateds_User = await userModel.findOneAndUpdate({ _id: req.params.id }, document, { new: true }).select("userName -_id")


  res.status(200).json({ message: "Update Success", updateds_User })
}


export const deleteUser = async (req, res, next) => {

  let _id = req.params.id || req.user._id

  // if (req.params.id != req.user._id)
  //   return next(new ErrorApp("Check your Id", 404))



  const deleteUser = await userModel.findByIdAndDelete(_id);
  res.status(200).json({ message: "Deleted Success", deleteUser })




}



export const changeUserPassword = async (req, res, next) => {

  const { oldPassword, newPassword } = req.body;

  const user = req.user;

  if (!compareSync(oldPassword, user.password)) return next(new ErrorApp("inCorrect old Password ", 300))

  user.password = newPassword;
  user.passwordChangedAt = Date.now();

  const fs = await user.save();

  const token = MakeJwt({
    userId: user._id,
    userName: user.userName,
    email: user.email,
    password: user.password,
  }, process.env.LOGIN)

  if (token.error) return next(new ErrorApp(User.error, 400))

  res.json({ messaeg: "Update Success", fs, token: token.token })
}


export const logeInWithGoogle = async (req, res, next) => {
  // const user = req.authUser;
  const { payload, userid } = await verifyGoogle(req.headers.token).catch(err => next(new ErrorApp(err)))

  if (!payload.email_verified) return next(new ErrorApp("Please Verify your Email", 400))

  const theUser = await userModel.findOne({ email: payload.email, provider: UserProviders.GOOGle })

  if (!theUser) return next(new ErrorApp("This user does not exist", 404))

  const theToken = MakeJwt({
    userId: theUser._id,
    userName: theUser.userName,
    email: theUser.email,
    password: theUser.password,
  }, process.env.LOGIN)

  if (theToken.error) return next(new ErrorApp(theToken.error, 400))

  theUser.isLoggedIn = true;

  const finalUser = await theUser.save()



  res.json({ message: "Success", theUser: finalUser, theToken })

}

export const SingUpWithGoogle = async (req, res, next) => {


  const { payload, userid } = await verifyGoogle(req.headers.token).catch(err => next(new ErrorApp(err)))

  if (!payload.email_verified) return next(new ErrorApp("Please Verify your Email", 400))

  const theUser = await userModel.findOne({ email: payload.email })

  if (theUser) return next(new ErrorApp("This user already exist", 404))


  const nanoid = customAlphabet(digits, 8);
  const password = nanoid();

  const newUser = new userModel({
    userName: payload.name,
    email: payload.email,
    password: password,
    provider: UserProviders.GOOGle
  })

  const finalUser = await newUser.save()



  res.json({ message: "Success", theUser: finalUser })

}
