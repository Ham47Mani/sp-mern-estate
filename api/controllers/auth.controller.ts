import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { HttpStatusCode } from "../utils/httpStatusCodes";
import userModel from "../models/user.model";
import { createItem, getItem } from "../utils/mongooseCruds";
import { handleResponseError, handleResponseSuccess } from "../utils/handleResponse";


// ======================= Signup User =======================
export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  // Check if all inputs empty
  if (!username || !email || !password) {
    res.status(HttpStatusCode.BADREQUEST);
    throw new Error('All fields (username, email, password) are required');
  }
  try {
    // Check if user exists
    const existingUser = await getItem(userModel, { email });
    if (existingUser) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, 'User already exists');
      return;
    }
    // Create new user
    const newUser = await createItem(userModel, req.body);
    handleResponseSuccess(res, HttpStatusCode.CREATED, 'User created successfully', [newUser]);
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, err.message);
    return;
  }
});