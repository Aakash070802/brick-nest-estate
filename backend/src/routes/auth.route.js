import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  googleController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * - POST /api/auth/register
 */
router.route("/register").post(upload.single("avatar"), registerController);

/**
 * - POST /api/auth/login
 */
router.route("/login").post(loginController);

/**
 * - POST /api/auth/google
 */
router.route("/google").post(googleController);

/**
 * @private authMiddleware
 * - GET /api/auth/logout
 */
router.route("/logout").get(authMiddleware, logoutController);

/**
 * - POST /api/auth/refreshToken
 */
router.route("/refreshToken").post(refreshTokenController);

export default router;
