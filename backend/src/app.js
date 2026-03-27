import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

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

/**
 * - ROUTES
 */
app.use("/api/auth", authRouter);

export { app };
