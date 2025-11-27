import multer from "multer";
import path from "path";

// Storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
