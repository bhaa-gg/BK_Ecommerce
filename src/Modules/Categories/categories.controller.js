import { nanoid } from "nanoid";
import slugify from "slugify";
import { cloudinaryConnection, ErrorApp } from "../../Utils/index.js";
import { categoryModel } from './../../../DB/Models/index.js';


export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(name, { replacement: "_", lower: true })

  if (!req.file) return next(new ErrorApp("Please Upload Image", 404))

  const customId = nanoid(4)
  const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`
    }
  )

  let finalCategory = {
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
  }

  const newCategory = await categoryModel.create(finalCategory)
  res.status(200).json({ message: "Success", newCategory })
}






export const getCategoryById = async (req, res, next) => {
  const { id, slug, name } = req.query
  const queryFilter = {}

  if (id) queryFilter._id = id
  if (slug) queryFilter.slug = slug
  if (name) queryFilter.name = name

  const findCategory = await categoryModel.findOne(queryFilter);
  return findCategory ? res.status(200).json({ message: "Success", findCategory }) : next(new ErrorApp("Couldn't find category", 404))
}




export const updateCategory = async (req, res, next) => {

  const { name } = req.body;
  if (name) {
    const slug = slugify(name, { replacement: "_", lower: true })
    req.category.name = name
    req.category.slug = slug
  }

  if (req.file) {

    const publicIds = req.category.Images.public_id.split('/').pop()

    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${req.category.customId}`,
        public_id: publicIds
      }
    )
    req.category.Images.secure_url = secure_url
    req.category.Images.public_id = public_id

  }

  await req.category.save();

  res.status(200).json({ message: "Successfully updated", newCategory: req.category })

}


export const deleteCategory = async (req, res, next) => {

  const { id } = req.params;

  const deletes = await categoryModel.findByIdAndDelete(id);

  if (!deletes) next(new ErrorApp("Id not found", 404));

  const categoryPath = `${process.env.UPLOADS_FOLDER}/Categories/${deletes.customId}`

  await cloudinaryConnection().api.delete_resources_by_prefix(categoryPath)
  await cloudinaryConnection().api.delete_folder(categoryPath)



  res.json({ message: "Deleted Category Successfully", deletes })


}