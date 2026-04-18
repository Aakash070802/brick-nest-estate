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

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "brickNest-images",
    });
    // console.log("File is Uploaded to cloudinary", response.url);
    fs.unlinkSync(localFilePath);
    // console.log(localFilePath);
    return response;
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);
    fs.unlinkSync(localFilePath);
    // console.log(localFilePath);
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
