import { Document, Schema, Types } from "mongoose";
import { LISTING_TYPE  } from "./costume.type";

// ---------------- User Modal Type ----------------
export interface USER extends Document {
  username: string,
  email: string,
  password: string,
  photo?: string

  // Add the "isPasswordMatched" to the interface
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
};

// ---------------- Listing Modal Type ----------------
export interface LISTING extends Document {
  name: string,
  description: string,
  address: string,
  regularPrice: number,
  discountPrice?: number,
  bathRooms: number,
  badRooms: number,
  furnished: boolean,
  parking: boolean,
  type: LISTING_TYPE,
  offer: boolean,
  imageURLs: string[],
  userRef: Schema.Types.ObjectId
}