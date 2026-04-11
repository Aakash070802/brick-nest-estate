import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { toggleFavorite } from "../controller/favorite.controller.js";

const router = Router();

router.route("/toggle").post(authMiddleware, toggleFavorite);

export default router;
