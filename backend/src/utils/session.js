import { Session } from "../models/session.model.js";
import bcrypt from "bcryptjs";

export const createSession = async (user, req, refreshToken) => {
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  return await Session.create({
    userId: user._id,
    refreshToken: hashedRefreshToken,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    device: req.headers["sec-ch-ua"] || "unknown",
  });
};
