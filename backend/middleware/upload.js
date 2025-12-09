import multer from "multer";
import path from "path";

// Storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        // sanitize original filename: remove path, replace spaces, strip unsafe chars
        const original = path.basename(file.originalname);
        const ext = path.extname(original);
        const name = path.basename(original, ext);
        const safeName = name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
        cb(null, Date.now() + "-" + safeName + ext);
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
