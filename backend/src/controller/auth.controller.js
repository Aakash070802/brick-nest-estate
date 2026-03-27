import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields required compulsorily!!");
  }

  /* USER EXISTS */
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this username and email exists!!");
  }

  /* Avatar upload Not necessary */
  let avatarUrl = "";
  let avatarPublicId = "";

  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file?.path);

    if (!uploaded) {
      throw new ApiError(500, "Avatar upload failed");
    }

    avatarUrl = uploaded.secure_url;
    avatarPublicId = uploaded.public_id;
  }

  const createdUser = await User.create({
    username,
    email,
    password,
    avatar: avatarUrl,
    avatarPublicId,
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating User!!");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "User created Successfully!", createdUser));
};

export { registerController };
