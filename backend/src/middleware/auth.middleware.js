import { config } from "../config/config.js";
import Blacklist from "../models/blacklist.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized Access, token is missing!");
  }

  const isBlacklisted = await Blacklist.findOne({ token });

  if (isBlacklisted) {
    throw new ApiError(401, "Unauthorized Access, token is blacklisted!");
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    if (!decodedToken?.id) {
      throw new ApiError(
        401,
        "Unauthorized Access, token is invalid via verification!"
      );
    }

    const user = await User.findById(decodedToken?.id);
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized Access");
  }
};

export { authMiddleware };
