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

  const safeUser = await User.findById(createdUser?._id);

  return res
    .status(201)
    .json(new ApiResponse(201, "User created Successfully!", safeUser));
};

const loginController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "All fields required compulsorily!!");
  }

  /* FIND USER BY EMAIL OR USERNAME */
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "Invalid Email ID or Username!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials!");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  const token = jwt.sign(
    {
      id: user?._id,
      email: user?.email,
    },
    config.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, "User logged In successfully", user, token));
};

export { registerController, loginController };
