import { config } from "../config/config.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_API,
  api_secret: config.CLOUD_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Check file exists before upload
    if (!fs.existsSync(localFilePath)) {
      throw new Error("File not found for upload");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "brickNest-images",
    });

    // Safe delete
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.warn("File delete failed:", err.message);
    }

    return response;
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error.message);

    // Safe delete again
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (err) {
      console.warn("Cleanup failed:", err.message);
    }

    throw new Error("Cloudinary upload failed");
  }
};

const deleteFromCloudinary = async (oldPublicId) => {
  if (!oldPublicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(oldPublicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
