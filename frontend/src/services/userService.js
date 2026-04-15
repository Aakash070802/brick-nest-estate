import api from "./api";

// Centralized response handler
const handleResponse = (res) => {
  return res?.data?.data ?? res?.data ?? null;
};

// Centralized error handler
const handleError = (err) => {
  const message =
    err?.response?.data?.message || err?.message || "Something went wrong";

  throw new Error(message);
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/user/me");
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

// Update user
export const updateUser = async (data) => {
  try {
    const res = await api.patch("/user/me", data);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

// Update avatar
export const updateAvatar = async (formData) => {
  try {
    const res = await api.patch("/user/me/avatar", formData);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

// Change password
export const changePassword = async (data) => {
  try {
    const res = await api.patch("/user/me/password", data);
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};

// Delete account
export const deleteAccount = async () => {
  try {
    const res = await api.delete("/user/me");
    return handleResponse(res);
  } catch (err) {
    handleError(err);
  }
};
