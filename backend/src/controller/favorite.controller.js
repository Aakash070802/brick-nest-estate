import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * @private toggleFavorite
 * @description Toggle a listing in the user's favorites. If the listing is already a favorite, it will be removed; otherwise, it will be added.
 * @POST /api/favorite/toggle
 */

const toggleFavorite = async (req, res) => {
  const userId = req.user._id;
  const { listingId } = req.body;

  if (!listingId) {
    throw new ApiError(400, "Listing ID required");
  }

  const user = await User.findById(userId);

  const isFav = user.favorites.includes(listingId);

  if (isFav) {
    user.favorites = user.favorites.filter((id) => id.toString() !== listingId);
  } else {
    user.favorites.push(listingId);
  }

  await user.save();

  return res.json(new ApiResponse(200, "Updated favorites", user.favorites));
};

export { toggleFavorite };
