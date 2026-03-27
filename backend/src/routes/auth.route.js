import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  googleController,
  loginController,
  logoutController,
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
 * - GET /api/auth/logout
 */
router.route("/logout").get(authMiddleware, logoutController);

export default router;
