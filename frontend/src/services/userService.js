import api from "./api";

// Get current user information
export const getCurrentUser = async () => {
  const res = await api.get("/user/me");
  return res.data.data;
};

// Update user information (name, email, etc.)
export const updateUser = async (data) => {
  const res = await api.patch("/user/me", data);
  return res.data.data;
};

// Update user avatar
export const updateAvatar = async (formData) => {
  const res = await api.patch("/user/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Change user password
export const changePassword = async (data) => {
  const res = await api.patch("/user/me/password", data);
  return res.data;
};

// Delete user account
export const deleteAccount = async () => {
  const res = await api.delete("/user/me");
  return res.data;
};
