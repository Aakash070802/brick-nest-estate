import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

// Ensure temp directory exists (CRITICAL)
const tempDir = path.resolve("public/temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only Image files allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
