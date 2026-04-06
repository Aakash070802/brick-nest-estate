import { Schema, model } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["restore-account", "forgot-password"],
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Otp = model("Otp", otpSchema);
