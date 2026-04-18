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

const inFlightRequests = new Map();

export const getAllListings = async ({
  page = 1,
  limit = 8,
  search = "",
  filters = {},
} = {}) => {
  try {
    let normalizedSearch = search?.trim().toLowerCase();

    if (normalizedSearch) {
      normalizedSearch = normalizedSearch
        .replace(/\b(\d+)\s*bhk\b/g, "$1 bedroom")
        .replace(/\bcheap\b/g, "low price affordable")
        .replace(/\bluxury\b/g, "premium high-end")
        .replace(/\bflat\b/g, "apartment");
    }

    if (normalizedSearch && normalizedSearch.length < 3) {
      normalizedSearch = "";
    }

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters || {}).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== false &&
          value !== "all",
      ),
    );

    const params = {
      page,
      limit,
      search: normalizedSearch,
      ...cleanedFilters,
    };

    // UNIQUE KEY (important)
    const requestKey = JSON.stringify(params);

    // DEDUPE: if already fetching, return same promise
    if (inFlightRequests.has(requestKey)) {
      return inFlightRequests.get(requestKey);
    }

    const requestPromise = api
      .get("/listing/all", {
        params,
        _skipLoader: true,
      })
      .then((res) => res.data.data)
      .finally(() => {
        inFlightRequests.delete(requestKey);
      });

    inFlightRequests.set(requestKey, requestPromise);

    return requestPromise;
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
