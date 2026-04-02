import { Schema, model } from "mongoose";

const listingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    regularPrice: {
      type: Number,
      required: [true, "Regular price is required"],
    },
    discountedPrice: {
      type: Number,
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
    },
    furnished: {
      type: Boolean,
      required: [true, "Furnished status is required"],
    },
    parking: {
      type: Boolean,
      required: [true, "Parking status is required"],
    },
    type: {
      type: String,
      enum: ["rent", "sell", "buy"],
      required: [true, "Type is required"],
    },
    offer: {
      type: Boolean,
      required: [true, "Offer status is required"],
    },
    imageUrls: [
      {
        url: String,
        public_id: String,
        _id: false,
      },
    ],
    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  { timestamps: true }
);

export const Listing = model("Listing", listingSchema);
