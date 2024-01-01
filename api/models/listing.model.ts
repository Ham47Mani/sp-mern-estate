import { Schema, model } from "mongoose";
import { LISTING} from "../utils/modale.type";
import { LISTING_TYPE } from '../utils/costume.type';

// Create user schema
const listingSchema: Schema<LISTING> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathRooms: {
      type: Number,
      required: true,
    },
    badRooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true
    },
    parking: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: LISTING_TYPE.SELL,
      enum: ["rent", "sell"],
      required: true
    },
    offer: {
      type: Boolean,
      required: true
    },
    imageURLs: [{
      type: String,
      required: true
    }],
    userRef: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }, {
    timestamps: true// Add timestamps option to automatically generate createdAt and updatedAt fields
  }
);

export default model<LISTING>("Listing", listingSchema);