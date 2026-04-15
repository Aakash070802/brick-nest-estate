import { Listing } from "../models/listing.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { logActivity } from "../utils/logger.js";
import { generateEmbedding } from "../utils/embeddings.js";
import { cosineSimilarity } from "../utils/similarity.js";

/**
 * @Helper Build Search Text
 */
const buildSearchText = (data) => {
  return `
    ${data.name}
    ${data.description}
    ${data.address}
    ${data.bedrooms} bedroom
    ${data.bathrooms} bathroom
    ${data.furnished ? "furnished" : "unfurnished"}
    ${data.parking ? "parking available" : ""}
    ${data.type}
  `.toLowerCase();
};

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

  // Upload images
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

  // Build search text
  const searchText = buildSearchText({
    name,
    description,
    address,
    bedrooms,
    bathrooms,
    furnished,
    parking,
    type,
  });

  // Generate embedding
  const embedding = await generateEmbedding(searchText);

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
    searchText,
    embedding,
  });

  await logActivity(req, req.user._id, "CREATED_PROPERTY");

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

  let properties = [];
  let total = 0;

  /**
   * 🔥 COMMON FILTERS (used in both flows)
   */
  const baseQuery = {};

  if (type && type !== "all") baseQuery.type = type;
  if (offer !== undefined) baseQuery.offer = offer === "true";
  if (furnished !== undefined) baseQuery.furnished = furnished === "true";
  if (parking !== undefined) baseQuery.parking = parking === "true";

  /**
   * 🚀 AI SEARCH FLOW
   */
  if (search && search.trim() !== "") {
    // Step 1: Convert query → embedding
    const queryEmbedding = await generateEmbedding(search);

    // Step 2: Fetch filtered listings
    const listings = await Listing.find(baseQuery).populate({
      path: "userRef",
      select: "username avatar",
    });

    // ⚠️ Edge case: no data
    if (!listings.length) {
      return res.status(200).json(
        new ApiResponse(200, "No properties found", {
          properties: [],
          pagination: {
            total: 0,
            page: parsedPage,
            limit: parsedLimit,
            hasMore: false,
          },
        })
      );
    }

    // Step 3: Score using cosine similarity
    const scoredListings = listings.map((item) => {
      const score = cosineSimilarity(queryEmbedding, item.embedding || []);

      return { item, score };
    });

    // Step 4: Sort by similarity (HIGH → LOW)
    scoredListings.sort((a, b) => b.score - a.score);

    // Step 5: Pagination AFTER ranking
    total = scoredListings.length;

    const paginatedResults = scoredListings
      .slice(skip, skip + parsedLimit)
      .map((entry) => entry.item);

    properties = paginatedResults;
  } else {
    /**
     * 🧠 NORMAL QUERY FLOW (NO SEARCH)
     */
    const sortOrder = order === "asc" ? 1 : -1;

    [properties, total] = await Promise.all([
      Listing.find(baseQuery)
        .populate({
          path: "userRef",
          select: "username avatar",
        })
        .sort({ [sort]: sortOrder })
        .limit(parsedLimit)
        .skip(skip),

      Listing.countDocuments(baseQuery),
    ]);
  }

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

  const listing = await Listing.findById(id).populate({
    path: "userRef",
    select: "username avatar",
  });

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

  await logActivity(req, userId, "PROPERTY_DELETED");

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

  // YOU MISSED THIS BEFORE → crash risk
  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Ownership check
  if (property.userRef.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  /**
   * HANDLE IMAGES
   */
  let keepImages = [];

  if (req.body.keepImages) {
    try {
      keepImages = JSON.parse(req.body.keepImages);
    } catch {
      throw new ApiError(400, "Invalid keepImages format");
    }
  }

  const oldImages = property.imageUrls;

  const imagesToDelete = oldImages.filter(
    (oldImg) =>
      !keepImages.some((keepImg) => keepImg.public_id === oldImg.public_id)
  );

  await Promise.all(
    imagesToDelete.map((img) =>
      deleteFromCloudinary(img.public_id).catch((err) =>
        console.log("Delete Failed:", err)
      )
    )
  );

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

  const finalImages = [...keepImages, ...newImages];

  /**
   * HANDLE FIELD UPDATES
   */
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

  /**
   * SMART EMBEDDING UPDATE (IMPORTANT)
   */
  const searchableFields = [
    "name",
    "description",
    "address",
    "bedrooms",
    "bathrooms",
    "furnished",
    "parking",
    "type",
  ];

  const shouldUpdateEmbedding = searchableFields.some(
    (field) => updates[field] !== undefined
  );

  if (shouldUpdateEmbedding) {
    const mergedData = {
      ...property.toObject(),
      ...updates,
    };

    const searchText = buildSearchText(mergedData);

    updates.searchText = searchText;
    updates.embedding = await generateEmbedding(searchText);
  }

  const updatedProperty = await Listing.findByIdAndUpdate(listId, updates, {
    new: true,
  });

  await logActivity(req, userId, "PROPERTY_UPDATED");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedProperty, "Listing updated successfully")
    );
};

/**
 * @seed seedListing
 * @description Seeds the database with sample listings for testing and development purposes. This function creates multiple listings with randomized data, including images uploaded to Cloudinary. It is intended to be run once to populate the database with initial data.
 * @POST /api/listing/seed
 */
const seedListings = async (req, res) => {
  const userId = req.user.id;

  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const listings = [];

  const cities = ["Raipur", "Bilaspur", "Durg", "Bhilai", "Korba"];
  const propertyTypes = ["rent", "sell"];
  const descriptions = [
    "Spacious and well-ventilated home",
    "Perfect for families and working professionals",
    "Prime location with all amenities nearby",
    "Modern design with great interiors",
    "Affordable and comfortable living space",
  ];

  for (let i = 1; i <= 500; i++) {
    const regularPrice = Math.floor(Math.random() * 50000) + 5000;
    const hasOffer = Math.random() > 0.5;

    listings.push({
      name: `Property ${Math.floor(Math.random() * 1000)}`,
      description: getRandom(descriptions),
      address: `${getRandom(cities)}, Chhattisgarh`,
      regularPrice,
      discountedPrice: hasOffer
        ? regularPrice - Math.floor(Math.random() * 5000)
        : undefined,
      bathrooms: Math.ceil(Math.random() * 4),
      bedrooms: Math.ceil(Math.random() * 5),
      furnished: Math.random() > 0.5,
      parking: Math.random() > 0.5,
      type: getRandom(propertyTypes),
      offer: hasOffer,
      imageUrls: [
        {
          url: `https://picsum.photos/400/300?random=${i}`,
          public_id: `seed_${i}`,
        },
      ],
      userRef: userId,
    });
  }

  await Listing.insertMany(listings);

  res.json({ message: "Seeded 500 random listings" });
};

export {
  createListing,
  getUserListings,
  getAllListings,
  getListingById,
  deleteListing,
  updateListing,
  seedListings,
};
