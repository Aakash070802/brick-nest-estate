import { Schema, model } from "mongoose";

const activitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
    },
    ip: String,
    userAgent: String,
    metadata: Object,
  },
  { timestamps: true }
);

export const Activity = model("Activity", activitySchema);
