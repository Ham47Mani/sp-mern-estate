import { Request } from "express";
import { USER } from "./modale.type";

// ---------------- CustomRequest ----------------
export interface CustomRequest extends Request {
  user?: USER; // Modify 'any' to match your user type if possible
}

// ---------------- Role type ----------------
export enum LISTING_TYPE {
  RENT = "rent",
  SELL = "sell"
}