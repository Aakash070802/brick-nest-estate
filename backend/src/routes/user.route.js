import { Router } from "express";
import {
  changePasswordController,
  getUser,
  updateAvatarController,
  updateUserController,
} from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @private getUser
 * @description Retrieves a user by their ID.
 * @GET /api/user/me
 */
router.route("/me").get(authMiddleware, getUser);

/**
 * @private updateUser
 * @description Updates a user's information by their ID.
 * @body { username: string, email: string }
 * @PATCH /api/user/me
 */
router.route("/me").patch(authMiddleware, updateUserController);

/**
 * @private updateAvatar
 * @description Updates a user's avatar by their ID.
 * @body { avatar: string }
 * @PATCH /api/user/me/avatar
 */
router.route("/me/avatar").patch(authMiddleware, updateAvatarController);

/**
 * @private changePassword
 * @description Changes a user's password by their ID.
 * @body  { currentPassword: string, newPassword: string }
 * @PATCH /api/user/me/password
 */
router.route("/me/password").patch(authMiddleware, changePasswordController);

export default router;
