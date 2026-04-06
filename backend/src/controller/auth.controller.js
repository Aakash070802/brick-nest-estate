import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { Session } from "../models/session.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import crypto from "crypto";
import { generateOtp, getOtpHtml } from "../utils/otp.js";
import { sendEmail } from "../services/email.service.js";
import bcrypt from "bcryptjs";
import { createSession } from "../utils/session.js";
import { logActivity } from "../utils/logger.js";

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
  await logActivity(req, safeUser._id, "REGISTER");

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
    throw new ApiError(403, "ACCOUNT_DEACTIVATED");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials!");
  }

  /* GENERATE ACCESS AND REFRESH TOKEN */
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  await createSession(user, req, refreshToken);

  const options = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  };

  const loggedInUser = sanitizeUser(user);
  await logActivity(req, user._id, "LOGIN_SUCCESS");

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
  const { email, name } = req.body;

  if (!email) {
    throw new ApiError(400, "Google auth failed");
  }

  let user = await User.findOne({ email });

  if (user && !user.isActive) {
    throw new ApiError(403, "ACCOUNT_DEACTIVATED");
  }

  const options = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  };

  if (user) {
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    await createSession(user, req, refreshToken);

    const safeUser = sanitizeUser(user);
    await logActivity(req, user._id, "GOOGLE_LOGIN");

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
    avatar: "",
    avatarPublicId: "",
  });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(newUser._id);

  await createSession(newUser, req, refreshToken);

  const safeNewUser = sanitizeUser(newUser);
  await logActivity(req, newUser._id, "GOOGLE_LOGIN");

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
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "Unauthorized Access, token is required for logout!"
    );
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, config.REFRESH_TOKEN_KEY);

    const sessions = await Session.find({
      userId: decoded.id,
      isValid: true,
    });

    let matchedSession = null;

    for (const session of sessions) {
      const isMatch = await bcrypt.compare(
        incomingRefreshToken,
        session.refreshToken
      );

      if (isMatch) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new ApiError(401, "Invalid session or already logged out");
    }

    matchedSession.isValid = false;
    await matchedSession.save();

    await logActivity(req, decoded.id, "LOGOUT");

    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, "User Logged out successfully"));
  } catch (error) {
    throw new ApiError(401, "Invalid Token");
  }
};

/**
 * @new SESSION AUTH
 * @function logoutAllController
 * @description Handles user logout from all devices.
 * @body {string} refreshToken - The refresh token of the user (required in cookies)
 * @GET /api/auth/logout-all
 */
const logoutAllController = async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "Unauthorized Access, token is required for logout!"
    );
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      config.REFRESH_TOKEN_KEY
    );

    await Session.updateMany({ userId: decodedToken.id }, { isValid: false });

    await logActivity(req, decodedToken.id, "LOGOUT_ALL");

    return res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, "Logged Out from All Devices."));
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
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
      throw new ApiError(403, "ACCOUNT_DEACTIVATED");
    }

    // New Session Auth based
    const sessions = await Session.find({
      userId: user?._id,
      isValid: true,
    });

    let matchedSession = null;

    for (const session of sessions) {
      const isMatch = await bcrypt.compare(
        incomingRefreshToken,
        session.refreshToken
      );

      if (isMatch) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new ApiError(401, "Invalid or reused refresh token");
    }

    matchedSession.isValid = false;
    await matchedSession.save();

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user?._id);

    await createSession(user, req, refreshToken);

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    };

    await logActivity(req, user._id, "TOKEN_REFRESH");

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
 * @description Handles the request for restoring a deactivated account by sending an OTP to the user's email
 * @body {string} email - The email of the user requesting account restoration
 * @POST /api/auth/request-restore-account
 */
const requestRestoreAccount = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.isActive) {
    throw new ApiError(400, "Invalid request");
  }

  // RATE LIMIT (1 min)
  const recentOtp = await Otp.findOne({
    email,
    purpose: "restore-account",
    createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    isValid: true,
  });

  if (recentOtp) {
    throw new ApiError(429, "Please wait before requesting another OTP");
  }

  // MAX 5 OTP/hour
  const count = await Otp.countDocuments({
    email,
    purpose: "restore-account",
    createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
  });

  if (count >= 5) {
    throw new ApiError(429, "Too many OTP requests. Try later.");
  }

  // SOFT INVALIDATE OLD OTPs
  await Otp.updateMany(
    { email, purpose: "restore-account", isValid: true },
    { $set: { isValid: false } }
  );

  const otp = generateOtp();
  const html = getOtpHtml(otp);
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.create({
    email,
    userId: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    purpose: "restore-account",
    isValid: true,
  });

  await sendEmail(email, "OTP verification", `Your OTP code is: ${otp}`, html);

  return res.json(new ApiResponse(200, "OTP sent"));
};

/**
 * @function verifyRestoreUser
 * @description Verifies the OTP provided by the user for account restoration and reactivates the account if the OTP is valid
 * @body {string} email - The email of the user requesting account restoration
 * @body {string} otp - The OTP provided by the user for verification
 * @POST /api/auth/verify-restore-account
 */
const verifyRestoreUser = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const record = await Otp.findOne({
    email,
    purpose: "restore-account",
    isValid: true,
  }).sort({ createdAt: -1 });

  if (!record) {
    throw new ApiError(400, "OTP not found");
  }

  // EXPIRED
  if (record.expiresAt < new Date()) {
    record.isValid = false;
    await record.save();
    throw new ApiError(400, "OTP expired");
  }

  // TOO MANY ATTEMPTS
  if (record.attempts >= 5) {
    record.isValid = false;
    await record.save();
    throw new ApiError(429, "Too many attempts");
  }

  const isMatch = await bcrypt.compare(otp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  // VALID OTP → invalidate it immediately
  record.isValid = false;
  await record.save();

  const user = await User.findById(record.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isActive) {
    throw new ApiError(400, "Account already active");
  }

  // RESTORE ACCOUNT
  user.isActive = true;
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  await createSession(user, req, refreshToken);

  const options = {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  };

  await logActivity(req, user._id, "RESTORE_LOGIN_SUCCESS");

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Account restored successfully", sanitizeUser(user))
    );
};

/**
 * @function forgotPasswordController
 * @description Handles {email} input, generates OTP and sends to user's email for password reset
 * @body {string} email - The email of the user requesting password reset
 * @POST /api/auth/forgot-password
 */
const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isActive) {
    throw new ApiError(403, "ACCOUNT_DEACTIVATED");
  }

  //  RATE LIMIT
  const recentOtp = await Otp.findOne({
    email,
    purpose: "forgot-password",
    createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    isValid: true,
  });

  if (recentOtp) {
    throw new ApiError(429, "Please wait before requesting another OTP");
  }

  // MAX 5/hour
  const count = await Otp.countDocuments({
    email,
    purpose: "forgot-password",
    createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
  });

  if (count >= 5) {
    throw new ApiError(429, "Too many requests. Try later.");
  }

  // Invalidate old OTPs
  await Otp.updateMany(
    { email, purpose: "forgot-password", isValid: true },
    { $set: { isValid: false } }
  );

  const otp = generateOtp();
  const html = getOtpHtml(otp);
  const otpHash = await bcrypt.hash(otp, 10);

  await Otp.create({
    email,
    userId: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    purpose: "forgot-password",
    isValid: true,
  });

  await sendEmail(email, "Reset Password OTP", `OTP: ${otp}`, html);

  return res.json(new ApiResponse(200, "OTP sent"));
};

/**
 * @function verifyForgotPasswordController
 * @description Handles OTP verification for forgot password flow
 * @body {string} email - The email of the user requesting password reset
 * @body {string} otp - The OTP provided by the user for verification
 * @POST /api/auth/verify-forgot-password
 */
const verifyForgotPasswordController = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({
    email,
    purpose: "forgot-password",
    isValid: true,
  }).sort({ createdAt: -1 });

  if (!record) {
    throw new ApiError(400, "OTP not found");
  }

  if (record.expiresAt < new Date()) {
    record.isValid = false;
    await record.save();
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= 5) {
    record.isValid = false;
    await record.save();
    throw new ApiError(429, "Too many attempts");
  }

  const isMatch = await bcrypt.compare(otp, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  record.isValid = false;
  await record.save();

  return res.json(new ApiResponse(200, "OTP verified"));
};

/**
 * @function resetPasswordController
 * @description Handles password reset functionality
 * @body {string} email - The email of the user requesting password reset
 * @body {string} otp - The OTP provided by the user for verification
 * @body {string} newPassword - The new password provided by the user
 * @POST /api/auth/reset-password
 */
const resetPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!newPassword) {
    throw new ApiError(400, "New password required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;
  await user.save();

  await Session.deleteMany({ userId: user?._id });
  await logActivity(req, user._id, "CHANGED_PASSWORD");

  return res.json(new ApiResponse(200, "Password reset successful"));
};

export {
  registerController,
  loginController,
  googleController,
  logoutController,
  logoutAllController,
  refreshTokenController,
  requestRestoreAccount,
  verifyRestoreUser,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
};
