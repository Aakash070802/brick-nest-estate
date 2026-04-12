import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListingById,
  getUserListings,
  seedListings,
  updateListing,
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

/**
 * @GET /api/listing/:id
 */
router.route("/:id").get(getListingById);

/**
 * @DELETE /api/listing/my-lists/:listId
 */
router.route("/my-lists/:listId").delete(authMiddleware, deleteListing);

/**
 * @PATCH /api/listing/my-lists/:listId
 */
router
  .route("/my-lists/:listId")
  .patch(authMiddleware, upload.array("images", 6), updateListing);

/**
 * @POST /api/listing/seed
 */
router.route("/seed").post(authMiddleware, seedListings);

export default router;
