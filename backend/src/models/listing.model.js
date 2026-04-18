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

    /**
     * AI SEARCH FIELDS
     */

    // Combined searchable text
    searchText: {
      type: String,
      index: true,
    },

    // Vector embedding for semantic search
    embedding: {
      type: [Number], // Array of floats
      default: [],
      index: false, // handled by vector DB or manual similarity
    },
  },
  { timestamps: true }
);

/**
 * TEXT INDEX (fallback search)
 */
listingSchema.index({
  name: "text",
  description: "text",
  address: "text",
  searchText: "text",
});

/**
 * AUTO GENERATE searchText BEFORE SAVE
 */
listingSchema.pre("save", function (next) {
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

  next();
});

export const Listing = model("Listing", listingSchema);
