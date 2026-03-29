import { Listing } from "../models/listing.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * @function createListing
 * @description Creates a new listing
 * @body { name: string, description: string, address: string, regularPrice: number, discountedPrice: number, bathrooms: number, bedrooms: number, furnished: boolean, parking: boolean, type: string, offer: boolean }
 * @POST /api/listing/create
 */
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
    imageUrls: uploadedImages,
    userRef: req.user._id,
  });
  //   console.log(uploadedImages);

  return res
    .status(201)
    .json(new ApiResponse(201, listing, "Listing created successfully"));
};

/**
 * @function getUserListings
 * @description Retrieves all listings for a specific user
 * @GET /api/listing/my-lists
 */
const getUserListings = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "Unauthorized Access, User not found!");
  }

  const property = await Listing.find({ userRef: user._id });

  if (!property || property.length === 0) {
    throw new ApiError(404, "Property not found!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Property Fetched Successfully", property));
};
export { createListing, getUserListings };
