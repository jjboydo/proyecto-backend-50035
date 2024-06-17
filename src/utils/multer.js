import multer from 'multer';
import __dirname from '../utils.js';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder;
        if (file.fieldname === "profileImage") {
            folder = "profiles";
        } else if (file.fieldname === "productImage") {
            folder = "products";
        } else if (file.mimetype === "application/pdf") {
            folder = "documents";
        }
        cb(null, path.join(__dirname, `public/uploads/${folder}`));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

export const uploader = multer({ storage: storage })