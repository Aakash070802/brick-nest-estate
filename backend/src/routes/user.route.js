import { Router } from "express";
import { getUser } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @private getUser
 * @description Retrieves a user by their ID.
 * @GET /api/user/me
 */
router.route("/me").get(authMiddleware, getUser);

export default router;
