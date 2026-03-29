import multer from "multer";
import path from "path";
import crypto from "crypto";

/**
 * @description Multer configuration for handling file uploads. It stores files in a temporary directory and generates unique filenames to prevent conflicts. The file filter ensures that only image files are accepted.
 * @returns {multer} Multer instance configured for file uploads.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

/**
 * @description File filter for Multer to allow only image files
 * @param {Object} req - The request object
 * @param {Object} file - The uploaded file object
 * @param {Function} cb - The callback function
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only Image files allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
