import { nanoid } from "nanoid";
import { proudctModel } from "../../../DB/Models/index.js";
import { apiFeaturs, calcPrice, cloudinaryConnection, ErrorApp, ReviewStatus, SlugTitle } from "../../Utils/index.js";
import { getIo } from "../../Common/Utils/Socket.utils.js";
import { makeQrCode } from "../../Common/Utils/QrCode.js";




export const addProducts = async (req, res, next) => {
    const { title, overview, specs, price, discountAmount, discountType, stock, badge } = req.body;


    if (!req.files.length)
        return next(new ErrorApp("No images uploaded", 400));

    const brandDocument = req.findData

    const customId = nanoid(4);
    let fixPath = brandDocument.logo.public_id.split('/')
    fixPath.pop()
    fixPath = fixPath.join("/")
    const path = `${fixPath}/Products/${customId}`


    let URLs = []
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
            file.path,
            {
                folder: path
            }
        )

        URLs.push({ secure_url, public_id })
    }
    const productObject = {
        title,
        overview,
        specs: JSON.parse(specs),
        badge,
        price,
        appliedDiscount: {
            amount: discountAmount,
            type: discountType,
        },
        stock,
        Images: {
            URLs,
            customId
        },
        categoryId: brandDocument.categoryId._id,
        subCategoryId: brandDocument.subCategoryId._id,
        brandId: brandDocument._id,
    }
    const newPrand = await proudctModel.create(productObject)

    getIo().emit("addSuccess", newPrand);
    res.status(201).json({ message: "Success ", newPrand })
}



export const updateProduct = async (req, res, next) => {
    const { price, title, stock, badge, overview, specs, discountAmount, discountType } = req.body;


    const Proudct = req.category
    if (title) {
        Proudct.title = title
        Proudct.slug = SlugTitle(title)
    }
    if (stock) Proudct.stock = stock
    if (badge) Proudct.badge = badge
    if (overview) Proudct.overview = overview
    if (specs) Proudct.specs = specs

    if (price || discountAmount || discountType) {
        const newPrice = price || Proudct.price

        const discount = {};
        discount.amount = discountAmount || Proudct.discountAmount
        discount.type = discountType || Proudct.discountType

        Proudct.appliedPrice = calcPrice(newPrice, discount)
        Proudct.price = newPrice
        Proudct.appliedDiscount = discount
    }

    await Proudct.save()
    res.json({ message: "Updated Success", Proudct })

}


export const listProducts = async (req, res, next) => {



    // const find_proudctModel = await proudctModel.paginate(
    //     finalFilters,
    //     {
    //         page,
    //         skip,
    //         limit,
    //         select: "-Images --spescs -categoryId -subCategoryId -brandId",
    //          sort: { appliedPrice: 1 },
    //     },
    // )

    const myFilterClass = new apiFeaturs(proudctModel.find().populate({
        path: "Reviews",
        match: { reviewStatus: ReviewStatus.Approved },
    }), req.query)

    let proudct = await myFilterClass.mongoosequery
    const qrCode = await makeQrCode({ title: proudct.at(0).title, appliedPrice: proudct.at(0).appliedPrice });

    res.json({ message: "success", proudct, limit: myFilterClass.query.limit, qrCode })
}



export const deleteProudct = async (req, res, next) => {
    const { id } = req.params

    const proudtc = await proudctModel.findByIdAndDelete(id)

    if (!proudtc)
        return next(new ErrorApp("This Proudct Not Found", 404))

    let path = proudtc.Images.URLs.at(0).public_id.split('/')
    path.pop();
    path = path.join("/")

    await cloudinaryConnection().api.delete_resources_by_prefix(path);
    await cloudinaryConnection().api.delete_folder(path);


    getIo().emit("deletesuccess", proudtc._id);

    res.json({ message: "Deleted Success" });
}