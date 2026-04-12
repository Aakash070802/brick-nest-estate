import api from "./api";

export const getMyListings = async () => {
  const res = await api.get("/listing/my-lists");
  return res.data.data;
};

export const createListing = async (formData) => {
  const res = await api.post("/listing/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteListing = async (id) => {
  const res = await api.delete(`/listing/my-lists/${id}`);
  return res.data;
};

export const updateListing = async (id, formData) => {
  const res = await api.patch(`/listing/my-lists/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

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

    const { data } = await api.get("/api/listing/all", { params });

    return data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch listings");
  }
};

export const getListingById = async (id) => {
  const res = await api.get(`/listing/${id}`);
  return res.data.data;
};

export const toggleFavorite = async (listingId) => {
  const res = await api.post("/favorite/toggle", { listingId });
  return res.data;
};
