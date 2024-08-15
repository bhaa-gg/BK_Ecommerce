
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import { cloudinaryConnection, ErrorApp } from '../../Utils/index.js';
import { subCategoryModel } from './../../../DB/Models/index.js';



export const createSubCategory = async (req, res, next) => {
    const { name } = req.body;
    const slug = slugify(name, {
        replacement: "_",
        lower: true
    });


    if (!req.file) return next(new ErrorApp("Please Upload Image", 404))

    const customId = nanoid(4)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
        req.file.path,
        {
            folder: `${process.env.UPLOADS_FOLDER}/Categories/${req.category.customId}/SubCategories/${customId}`,
        }
    )
    const subCategoryObj = {
        name, slug,
        Images: {
            secure_url
            , public_id
        },
        customId,
        categoryId: req.category._id
    }

    const newSubCategory = await subCategoryModel.create(subCategoryObj);

    res.status(200).json({ message: "Success", category: newSubCategory })
}


export const getSubCategory = async (req, res, next) => {

    const { id } = req.params
    const { slug, name } = req.query

    const findFilter = {}
    if (id) findFilter._id = id
    if (slug) findFilter.slug = slug
    if (name) findFilter.name = name


    const find = await subCategoryModel.findOne(findFilter)

    return find ? res.status(200).json({ message: "Success", sub_Category: find }) :


        next(new ErrorApp("This SubCategory Not Found", 404))
}


export const updateSubCategory = async (req, res, next) => {
    const { name } = req.body
    const mySubCategory = req.category

    if (name) {
        const slug = slugify(name, { lower: true, replacement: "_" })
        mySubCategory.slug = slug;
        mySubCategory.name = name;
    }

    if (req.file) {
        const myPaths = mySubCategory.Images.public_id.split('/');
        const publicIds = myPaths.pop();
        const Folder = myPaths.join("/");
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
            req.file.path,
            {
                folder: Folder,
                public_id: publicIds
            }
        )
        mySubCategory.Images.secure_url = secure_url;
        mySubCategory.Images.public_id = public_id;
    }

    await mySubCategory.save();

    res.status(200).json({ message: "Success", newSubCategory: mySubCategory })
}


export const deleteSubCategory = async (req, res, next) => {
    const { id } = req.params

    const findSubCategory = await subCategoryModel.findByIdAndDelete(id)

    if (!findSubCategory) next(new ErrorApp("This subCategory Id not found", 404));


    let path = findSubCategory?.Images.public_id.split("/")
    path.pop();
    path = path.join("/")

    await cloudinaryConnection().api.delete_resources_by_prefix(path);
    await cloudinaryConnection().api.delete_folder(path);



    res.json({ message: "Deleted Successfully", findSubCategory })

}