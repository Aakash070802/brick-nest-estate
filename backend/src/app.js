import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

/**
 * - MIDDLEWARES
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

/**
 * - IMPORT ROUTES
 */
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import favoriteRouter from "./routes/favorite.route.js";

/**
 * - ROUTES
 */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/favorite", favoriteRouter);
app.use(errorMiddleware);

export { app };
