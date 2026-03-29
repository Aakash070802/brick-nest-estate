import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  googleController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  requestRestoreAccount,
  verifyRestoreUser,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @POST /api/auth/register
 */
router.route("/register").post(upload.single("avatar"), registerController);

/**
 * @POST /api/auth/login
 */
router.route("/login").post(loginController);

/**
 * @POST /api/auth/google
 */
router.route("/google").post(googleController);

/**
 * @private authMiddleware
 * @GET /api/auth/logout
 */
router.route("/logout").get(authMiddleware, logoutController);

/**
 * @POST /api/auth/refresh-token
 */
router.route("/refresh-token").post(refreshTokenController);

/**
 * @POST /api/auth/request-restore-account
 */
router.route("/request-restore-account").post(requestRestoreAccount);
/**
 * @POST /api/auth/verify-restore-account
 */
router.route("/verify-restore-account").post(verifyRestoreUser);
export default router;
