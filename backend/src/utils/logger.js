import { Activity } from "../models/activity.model.js";

export const logActivity = async (req, userId, action, metadata = {}) => {
  try {
    await Activity.create({
      userId,
      action,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata,
    });
  } catch (err) {
    console.log("Log failed:", err.message);
  }
};
