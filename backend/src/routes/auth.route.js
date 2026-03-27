import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { registerController } from "../controller/auth.controller.js";

const router = Router();

/**
 * - POST /api/auth/register
 */
router.route("/register").post(upload.single("avatar"), registerController);

/**
 * - POST /api/auth/login
 */
// router.route("/login").post();

/**
 * - POST /api/auth/google
 */
// router.route("/google").post();

/**
 * - GET /api/auth/logout
 */
// router.route("/logout").get();

export default router;
