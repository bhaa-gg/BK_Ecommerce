import multer from "multer"
import { ErrorApp, extensible } from "../Utils/index.js"


export const multerMiddle = (allowed = extensible.img) => {
    const storage = multer.diskStorage({})

    const fileFilter = (req, file, cb) => {
        allowed.includes(file.mimetype) ? cb(null, true) :
            cb(new ErrorApp("invalid file type", 400, "invalid file type"), false)
    }

    const fileUploaded = multer({
        storage,
        fileFilter,
    });
    return fileUploaded
}