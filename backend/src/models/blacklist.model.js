import { Schema, model } from "mongoose";

const blacklistSchema = new Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be blacklisted"],
      unique: [true, "Token already blacklisted"],
    },
  },
  { timestamps: true },
);

const Blacklist = model("Blacklist", blacklistSchema);

export default Blacklist;
