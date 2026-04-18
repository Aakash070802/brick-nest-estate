import { Schema, model } from "mongoose";

const listingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
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
      enum: ["rent", "sell"],
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

    searchText: {
      type: String,
    },
  },
  { timestamps: true }
);

// TEXT INDEX (ONLY ONE, CLEAN)
listingSchema.index({
  name: "text",
  description: "text",
  address: "text",
  searchText: "text",
});

// AUTO GENERATE searchText
listingSchema.pre("save", function () {
  this.searchText = `
    ${this.name}
    ${this.description}
    ${this.address}
    ${this.bedrooms} bedroom
    ${this.bathrooms} bathroom
    ${this.furnished ? "furnished" : "unfurnished"}
    ${this.parking ? "parking available" : ""}
    ${this.type}
  `.toLowerCase();
});

export const Listing = model("Listing", listingSchema);
