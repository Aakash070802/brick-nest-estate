import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

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

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized Access");
  }
};

export { authMiddleware };
