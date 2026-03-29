import { config } from "../config/config.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * @private getUser
 * @description Retrieves a user by their ID.
 * @GET /api/user/:id
 */
const getUser = async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "Unauthorized Access, user not found!");
  }

  return res.status(200).json(new ApiResponse(200, "User Fetched!", user));
};

export { getUser };
