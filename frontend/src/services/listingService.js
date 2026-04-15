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
    const params = {
      page,
      limit,
      search,
      ...filters,
    };

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
