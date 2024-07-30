import slugify from "slugify";
import { nanoid } from "nanoid";
import { cloudinaryConnection, ErrorApp } from "../../Utils/index.js";
import { brandModel } from "../../../DB/Models/index.js";



export const createBrand = async (req, res, next) => {
    const { name } = req.body;
    const subCategoryData = req.findData

    const slug = slugify(name, { lower: true, replacement: "_" });

    if (!req.file) return next(new ErrorApp("Please Upload Image", 404))


    const customId = nanoid(4)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
        req.file.path,
        {
            folder: `${process.env.UPLOADS_FOLDER}/Categories/${subCategoryData.categoryId.customId}/SubCategories/${subCategoryData.customId}/Brands/${customId}`,
        }
    )


    const myBrand = {
        name,
        slug,
        logo: {
            secure_url, public_id
        },
        customId,
        categoryId: subCategoryData.categoryId._id,
        subCategoryId: subCategoryData._id,
    }

    const Brand = await brandModel.create(myBrand)

    res.status(200).json({ message: "Success", Brand })
}



export const getBrand = async (req, res, next) => {
    const { id, slug, name } = req.query
    const queryFilter = {}

    if (id) queryFilter._id = id
    if (slug) queryFilter.slug = slug
    if (name) queryFilter.name = name

    const findBrand = await brandModel.findOne(queryFilter);

    return findBrand ? res.status(200).json({ message: "Success", findBrand }) : next(new ErrorApp("Couldn't find Brand", 404))
}


export const updateBrand = async (req, res, next) => {
    const { name } = req.body;
    const newBrand = req.category;

    if (name) {
        const slug = slugify(name, { lower: true, replacement: "_" });
        newBrand.slug = slug;
        newBrand.name = name;
    }

    if (req.file) {

        const path = newBrand.logo.public_id.split("/");
        const publicId = path.pop();
        const folder = path.join("/");


        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
            req.file.path,
            {
                folder: folder,
                public_id: publicId
            }
        )
        newBrand.logo.public_id = public_id;
        newBrand.logo.secure_url = secure_url;
    }
    await newBrand.save(newBrand);


    res.status(200).json({ message: "Sucess", newBrand });
}




export const deleteBrand = async (req, res, next) => {


    const { id } = req.params;


    const deletes = await brandModel.findByIdAndDelete(id);

    if (!deletes) next(new ErrorApp("Id not found", 404));



    let path = deletes.logo.public_id.split("/")
    path.pop();
    path = path.join("/")

    await cloudinaryConnection().api.delete_resources_by_prefix(path)
    await cloudinaryConnection().api.delete_folder(path)

    res.json({ message: "Deleted Successfully", deletes })


}