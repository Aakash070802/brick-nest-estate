import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

/**
 * @function authMiddleware
 * @description Middleware to authenticate users
 * @param {Object} req - The request object
 * @param {Object} _ - The response object (not used)
 * @param {Function} next - The next middleware function
 * @returns {req.user} The authenticated user object attached to the request
 * @throws {ApiError} Throws an ApiError if authentication fails
 */
const authMiddleware = async (req, _, next) => {
  const token =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized Access, token is missing!");
  }

  try {
    const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_KEY);

    if (!decodedToken?.id) {
      throw new ApiError(
        401,
        "Unauthorized Access, token is invalid via verification!"
      );
    }

    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account is deactivated");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("MIDDLEWARE Error: ", error);
    throw new ApiError(401, "Unauthorized Access");
  }
};

export { authMiddleware };
