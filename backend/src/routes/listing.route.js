import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createListing,
  getAllListings,
  getUserListings,
} from "../controller/listing.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @POST /api/listing/create
 */
router.post(
  "/create",
  authMiddleware,
  upload.array("images", 6), // max 6 images
  createListing
);

/**
 * @GET /api/listing/my-lists
 */
router.route("/my-lists").get(authMiddleware, getUserListings);

/**
 * @GET /api/listing/all
 */
router.route("/all").get(getAllListings);

export default router;
