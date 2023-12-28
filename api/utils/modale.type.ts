import { Document, Types } from "mongoose";
import { ORDERSTATUS, OrderProduct, ROLE } from "./costume.type";

// ---------------- User Modal Type ----------------
export interface USER extends Document {
  username: string,
  email: string,
  password: string,
  photo?: string

  // Add the "isPasswordMatched" to the interface
  isPasswordMatched(enteredPassword: string): Promise<boolean>;
};