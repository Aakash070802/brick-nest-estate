import api from "./api";

// Get user's listings (blocking → keep loader)
export const getMyListings = async () => {
  try {
    const res = await api.get("/listing/my-lists");
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch listings");
  }
};

// Create listing (blocking)
export const createListing = async (formData) => {
  try {
    const res = await api.post("/listing/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to create listing");
  }
};

// Delete listing (blocking)
export const deleteListing = async (id) => {
  try {
    const res = await api.delete(`/listing/my-lists/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to delete listing");
  }
};

// Update listing (blocking)
export const updateListing = async (id, formData) => {
  try {
    const res = await api.patch(`/listing/my-lists/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update listing");
  }
};

// Get all listings (NON-BLOCKING → skeleton)
export const getAllListings = async ({
  page = 1,
  limit = 8,
  search = "",
  filters = {},
} = {}) => {
  try {
    /**
     * STEP 1: Normalize search
     */
    let normalizedSearch = search?.trim().toLowerCase();

    /**
     * STEP 2: Basic query shaping (VERY IMPORTANT)
     * This improves embedding quality without calling AI again
     */
    if (normalizedSearch) {
      // simple replacements (expand intent)
      normalizedSearch = normalizedSearch
        .replace(/\b(\d+)\s*bhk\b/g, "$1 bedroom")
        .replace(/\bcheap\b/g, "low price affordable")
        .replace(/\bluxury\b/g, "premium high-end")
        .replace(/\bflat\b/g, "apartment");
    }

    /**
     * STEP 3: Prevent useless calls
     */
    if (normalizedSearch && normalizedSearch.length < 3) {
      normalizedSearch = "";
    }

    /**
     * STEP 4: Clean filters safely
     */
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters || {}).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== false &&
          value !== "all",
      ),
    );

    /**
     * STEP 5: Build params
     */
    const params = {
      page,
      limit,
      search: normalizedSearch,
      ...cleanedFilters,
    };

    /**
     * 🚀 API CALL
     */
    const { data } = await api.get("/listing/all", {
      params,
      _skipLoader: true,
    });

    return data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch listings");
  }
};

// Get single listing (NON-BLOCKING)
export const getListingById = async (id) => {
  try {
    const res = await api.get(`/listing/${id}`, {
      _skipLoader: true,
    });
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch listing");
  }
};

// Toggle favorite (NON-BLOCKING)
export const toggleFavorite = async (listingId) => {
  try {
    const res = await api.post(
      "/favorite/toggle",
      { listingId },
      { _skipLoader: true },
    );

    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to update favorite");
  }
};
