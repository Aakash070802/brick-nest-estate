import { Listing } from "../models/listing.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

const createListing = async (req, res) => {
  const {
    name,
    description,
    address,
    regularPrice,
    discountedPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
  } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    throw new ApiError(400, "Images are required!");
  }
  if (
    !name ||
    !description ||
    !address ||
    !regularPrice ||
    !bathrooms ||
    !bedrooms ||
    !type
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  if (discountedPrice && discountedPrice >= regularPrice) {
    throw new ApiError(400, "Discounted price must be less than regular price");
  }

  const uploadedImages = [];

  for (const file of files) {
    const result = await uploadOnCloudinary(file.path);

    if (!result) {
      throw new ApiError(500, "Image upload failed");
    }

    uploadedImages.push({
      url: result.secure_url,
      public_id: result.public_id,
    });
  }

  const listing = await Listing.create({
    name,
    description,
    address,
    regularPrice,
    discountedPrice,
    bathrooms,
    bedrooms,
    furnished,
    parking,
    type,
    offer,
    imageUrls: uploadedImages.map((img) => img.url),
    userRef: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, listing, "Listing created successfully"));
};
