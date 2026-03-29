import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

/**
 * @private getUser
 * @description Retrieves a user by their ID.
 * @GET /api/user/me
 */
const getUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized Access, user not found!");
  }

  return res.status(200).json(new ApiResponse(200, "User Fetched!", user));
};

/**
 * @private updateUser
 * @description Updates a user's information by their ID.
 * @body { username: string, email: string }
 * @PATCH /api/user/me
 */
const updateUserController = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized Access, user not found!");
  }

  const { username, email } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "At least one field is required to update");
  }

  /* DUPLICATE CHECK */
  if (email) {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw new ApiError(409, "Email already in use");
    }
  }

  if (username) {
    const existingUser = await User.findOne({ username });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw new ApiError(409, "Username already in use");
    }
  }

  if (username) user.username = username;
  if (email) user.email = email;

  const updatedUser = await user.save();

  const safeUser = updatedUser.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;

  return res
    .status(200)
    .json(new ApiResponse(200, "User Details Updated successfully!", safeUser));
};

/**
 * @private updateAvatar
 * @description Updates a user's avatar by their ID.
 * @body { avatar: string }
 * @PATCH /api/user/me/avatar
 */
const updateAvatarController = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized Access, user not found!");
  }

  if (!req.file?.path) {
    throw new ApiError(400, "Avatar file is required");
  }

  const uploaded = await uploadOnCloudinary(req.file?.path);

  if (!uploaded) {
    throw new ApiError(500, "Avatar upload failed!");
  }

  if (user?.avatarPublicId) {
    await deleteFromCloudinary(user?.avatarPublicId);
  }

  user.avatar = uploaded.secure_url;
  user.avatarPublicId = uploaded.public_id;

  const updatedUser = await user.save();

  const safeUser = updatedUser.toObject();
  delete safeUser.password;
  delete safeUser.refreshToken;
  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar Updated Successfully.", safeUser));
};

/**
 * @private changePassword
 * @description Changes a user's password by their ID.
 * @body  { currentPassword: string, newPassword: string }
 * @PATCH /api/user/me/password
 */
const changePasswordController = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new Password required!");
  }

  const user = await User.findById(req.user?._id).select("+password");

  const isPasswordMatch = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordMatch) {
    throw new ApiError(400, "Invalid password!");
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed Successfully", {}));
};

/**
 * @private deleteUser
 * @description Deletes a user by their ID.
 * @DELETE /api/user/me
 */
const deleteUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized Access, user not found!");
  }

  try {
    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }
  } catch (err) {
    console.error("Old avatar delete failed:", err);
  }

  user.isActive = false;
  user.refreshToken = "";
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Account deactivated successfully."));
};

export {
  getUser,
  updateUserController,
  updateAvatarController,
  changePasswordController,
  deleteUser,
};
