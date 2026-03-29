import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
/**
 * @function generateAccessTokenAndRefreshToken
 * @description Generates access token and refresh token for a user
 * @returns {Object} An object containing access token and refresh token
 */
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens!"
    );
  }
};

/**
 * @function sanitizeUser
 * @description Sanitizes the user object by removing sensitive fields like password and refreshToken
 * @param {Object} user - The user object to be sanitized
 * @returns {Object} The sanitized user object without password and refreshToken
 */
const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

/**
 * @function registerController
 * @description Handles user registration
 * @body {string} username - The username of the user
 * @body {string} email - The email of the user
 * @body {string} password - The password of the user
 * @body {file} avatar - The avatar image file of the user (optional)
 * @POST /api/auth/register
 */
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

/**
 * @function loginController
 * @description Handles user login
 * @body {string} username - The username of the user (optional if email is provided)
 * @body {string} email - The email of the user (optional if username is provided)
 * @body {string} password - The password of the user
 * @POST /api/auth/login
 */
const loginController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or Email ID is required!");
  }
  if (!password) {
    throw new ApiError(400, "Password is required!");
  }

  /* FIND USER BY EMAIL OR USERNAME */
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid Email ID or Username!");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials!");
  }

  /* GENERATE ACCESS AND REFRESH TOKEN */
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  };

  const loggedInUser = sanitizeUser(user);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User logged In successfully", loggedInUser));
};

/**
 * @function googleController
 * @description Handles Google authentication
 * @body {string} email - The email of the user (required)
 * @body {string} name - The name of the user (required)
 * @body {string} photo - The URL of the user's Google profile photo (optional)
 * @POST /api/auth/google
 */
const googleController = async (req, res) => {
  const { email, name, photo } = req.body;

  if (!email) {
    throw new ApiError(400, "Google auth failed");
  }

  let user = await User.findOne({ email });

  if (user && !user.isActive) {
    throw new ApiError(403, "Account is deactivated");
  }

  const options = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  };

  if (user) {
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const safeUser = sanitizeUser(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, "Login success", safeUser));
  }

  // If user doesn't exist → create (Google Signup)
  const randomPassword = crypto.randomBytes(16).toString("hex");

  const newUser = await User.create({
    username: name.replace(/\s+/g, "").toLowerCase(),
    email,
    password: randomPassword,
    avatar: photo,
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(newUser._id);

  const safeNewUser = sanitizeUser(newUser);

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, "Google signup success", safeNewUser));
};

/**
 * @function logoutController
 * @description Handles user logout
 * @body {string} refreshToken - The refresh token of the user (required in cookies)
 * @GET /api/auth/logout
 */
const logoutController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(
      401,
      "Unauthorized Access, token is required for logout!"
    );
  }

  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = "";
    await user.save({ validateBeforeSave: false });
  }
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, "User Logged out successfully"));
};

/**
 * @function refreshTokenController
 * @description Handles refreshing of access token using refresh token
 * @body {string} refreshToken - The refresh token of the user (required in cookies)
 * @POST /api/auth/refresh-token
 */
const refreshTokenController = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Access, token is required!");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      config.REFRESH_TOKEN_KEY
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account is deactivated");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message ||
        "Something went wrong during Refreshing the Access Token"
    );
  }
};

/**
 * @function requestRestoreAccount
 * @description Handles the request for account restoration by generating an OTP and sending it to the user's email
 * @body {string} email - The email of the user requesting account restoration (required)
 * @POST /api/auth/request-restore-account
 */
const requestRestoreAccount = async (req, res) => {
  const { emai };
};

export {
  registerController,
  loginController,
  googleController,
  logoutController,
  refreshTokenController,
};
