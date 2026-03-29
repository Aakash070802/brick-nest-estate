import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createListing } from "../controllers/listing.controller.js";

const router = Router();

/**
 * @POST /api/listing/create
 */
router.post(
  "/create",
  verifyJWT,
  upload.array("images", 6), // max 6 images
  createListing
);

export default router;
