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

export const getAllListings = async () => {
  const res = await api.get("/listing/all");
  return res.data.data;
};

export const getListingById = async (id) => {
  const res = await api.get(`/listing/${id}`);
  return res.data.data;
};

export const toggleFavorite = async (listingId) => {
  const res = await api.post("/favorite/toggle", { listingId });
  return res.data;
};
