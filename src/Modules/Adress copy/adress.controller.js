import { addressesModel } from "../../../DB/Models/index.js";
import { ErrorApp } from '../../Utils/index.js';





export const addAddress = async (req, res, next) => {

  const userId = req.authUser._id

  const {
    country, city, buildingNumber, postalCode, isDefault, floorNumber, addressLabel
  } = req.body;



  const addressInstances = new addressesModel({
    addressLabel, userId, country, city, postalCode, buildingNumber, floorNumber,
    isDefault: [true, false].includes(isDefault) ? isDefault : false
  })

  const newAddress = await addressInstances.save();

  res.status(201).json({ message: "Address added successfully", newAddress })
}

export const editAddress = async (req, res, next) => {
  const { addressId } = req.params;
  const user = req.authUser;

  const address = await addressesModel.findOne({ _id: addressId, userId: user._id, isMarkedAsDeleted: false })

  if (!address) return next(new ErrorApp("This address does not exist", 404));


  if (req.body.isDefault)
    address.isDefault = [true, false].includes(req.body.isDefault) ? req.body.isDefault : false;


  if (req.body.country) address.country = req.body.country;
  if (req.body.city) address.city = req.body.city;
  if (req.body.buildingNumber) address.buildingNumber = req.body.buildingNumber;
  if (req.body.postalCode) address.postalCode = req.body.postalCode;
  if (req.body.floorNumber) address.floorNumber = req.body.floorNumber;
  if (req.body.addressLabel) address.addressLabel = req.body.addressLabel;

  await address.save()
  res.json({ message: "Update Success", address })

}

export const deleteAddress = async (req, res, next) => {
  const { addressId } = req.params;
  const user = req.authUser;

  const address = await addressesModel.findOneAndUpdate(
    { _id: addressId, userId: user._id, isMarkedAsDeleted: false },
    { isMarkedAsDeleted: true, isDefault: false }, { new: true }
  )
  // address.
  if (!address) return next(new ErrorApp("This address does not exist", 404));


  // await addressesModel.findOneAndUpdate(
  //   { userId: user._id, _id: { $ne: addressId }, isMarkedAsDeleted: false },
  //   { isDefault: true },
  //   { new: true }
  // );

  res.json({ message: "deleted Success", address })

}

export const gerAddressess = async (req, res, next) => {
  const { addressId } = req.params;
  const user = req.authUser;

  const address = await addressesModel.findOneAndUpdate(
    { _id: addressId, userId: user._id, isMarkedAsDeleted: false },
    { isMarkedAsDeleted: false, isDefault: false }, { new: true }
  )

  if (!address) return next(new ErrorApp("This address does not exist", 404));


  res.json({ message: "deleted Success", address })

}