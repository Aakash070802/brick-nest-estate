import { Listing } from "../models/listing.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

/**
 * @private createListing
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
    .json(new ApiResponse(201, "Listing created successfully", listing));
};

/**
 * @private getUserListings
 * @description Retrieves all listings for a specific user
 * @GET /api/listing/my-lists
 */
const getUserListings = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized Access");
  }

  const property = await Listing.find({ userRef: user._id });

  res
    .status(200)
    .json(new ApiResponse(200, "Property Fetched Successfully", property));
};

/**
 * @private getAllListings
 * @description Retrieves all listings with optional filters and pagination
 * @GET /api/listing/all
 * @query { limit: number, page: number, search: string, type: string, offer: boolean, furnished: boolean, parking: boolean, sort: string, order: string }
 */
const getAllListings = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    search = "",
    type,
    offer,
    furnished,
    parking,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const parsedLimit = Math.max(1, Number(limit));
  const parsedPage = Math.max(1, Number(page));
  const skip = (parsedPage - 1) * parsedLimit;

  const query = {};

  // search
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // filters
  if (type && type !== "all") {
    query.type = type;
  }

  if (offer !== undefined) {
    query.offer = offer === "true";
  }

  if (furnished !== undefined) {
    query.furnished = furnished === "true";
  }

  if (parking !== undefined) {
    query.parking = parking === "true";
  }

  // sorting
  const sortOrder = order === "asc" ? 1 : -1;

  // PARALLEL QUERIES
  const [properties, total] = await Promise.all([
    Listing.find(query)
      .sort({ [sort]: sortOrder })
      .limit(parsedLimit)
      .skip(skip),

    Listing.countDocuments(query),
  ]);

  const hasMore = skip + properties.length < total;

  return res.status(200).json(
    new ApiResponse(200, "Properties Fetched Successfully", {
      properties,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        hasMore,
      },
    })
  );
};

/**
 * @private getListingById
 * @description Retrieves a single listing by ID
 * @GET /api/listing/:id
 */
const getListingById = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ApiError(404, "Listing not found");
  }

  return res.json(new ApiResponse(200, "Listing fetched", listing));
};

/**
 * @private deleteListing
 * @description Deletes a listing by ID, only if the authenticated user is the owner
 * @DELETE /api/listing/my-lists/:listId
 */
const deleteListing = async (req, res) => {
  const { listId } = req.params;
  const userId = req.user?._id;

  if (!listId) {
    throw new ApiError(400, "Listing ID is required");
  }

  const property = await Listing.findById(listId);

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // OwnerShip
  if (property.userRef.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this property!");
  }

  // Delete from cloudinary
  const images = property.imageUrls || [];

  await Promise.all(
    images.map((img) =>
      deleteFromCloudinary(img.public_id).catch((err) => {
        console.error("Cloudinary delete failed:", err);
      })
    )
  );

  // Delete from DB
  await property.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Property deleted successfully"));
};

/**
 * @private updateListing
 * @description Updates a listing by ID, only if the authenticated user is the owner. Supports updating fields and managing images (keep existing, add new, delete removed).
 * @PATCH /api/listing/my-lists/:listId
 */
const updateListing = async (req, res) => {
  const { listId } = req.params;
  const userId = req.user?._id;

  if (!listId) {
    throw new ApiError(400, "Listing ID is required!");
  }

  const property = await Listing.findById(listId);

  // OwnerShip
  if (property.userRef.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  // Parse Keep Images
  let keepImages = [];
  if (req.body.keepImages) {
    try {
      keepImages = JSON.parse(req.body.keepImages);
    } catch (error) {
      throw new ApiError(400, "Invalid keepImages format");
    }
  }
  // console.log("BODY:", req.body);

  // Old images
  const oldImages = property.imageUrls;

  // Images to delete
  const imagesToDelete = oldImages.filter(
    (oldImg) =>
      !keepImages.some((keepImg) => keepImg.public_id === oldImg.public_id)
  );

  // Delete from cloudinary
  await Promise.all(
    imagesToDelete.map((img) =>
      deleteFromCloudinary(img.public_id).catch((err) => {
        console.log("Delete Failed: ", err);
      })
    )
  );

  // Upload new Images
  let newImages = [];

  if (req.files && req.files.length > 0) {
    newImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadOnCloudinary(file.path);
        if (!result) {
          throw new ApiError(500, "Image upload failed");
        }
        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );
  }
  // console.log("FILES:", req.files);

  // Final Images
  const finalImages = [...keepImages, ...newImages];

  const allowedFields = [
    "name",
    "description",
    "address",
    "regularPrice",
    "discountedPrice",
    "bathrooms",
    "bedrooms",
    "furnished",
    "parking",
    "type",
    "offer",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (
    updates.discountedPrice &&
    updates.regularPrice &&
    updates.discountedPrice >= updates.regularPrice
  ) {
    throw new ApiError(400, "Invalid price logic");
  }

  updates.imageUrls = finalImages;

  const updateProperty = await Listing.findByIdAndUpdate(listId, updates, {
    new: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updateProperty, "Listing updated successfully"));
};

export {
  createListing,
  getUserListings,
  getAllListings,
  getListingById,
  deleteListing,
  updateListing,
};
