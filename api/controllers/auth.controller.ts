import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { HttpStatusCode } from "../utils/httpStatusCodes";
import userModel from "../models/user.model";
import { createItem, getItem } from "../utils/mongooseCruds";
import { handleResponseError, handleResponseSuccess } from "../utils/handleResponse";
import { USER } from "../utils/modale.type";
import { generateToken } from "../utils/jwtToken";
import { JwtPayload } from "jsonwebtoken";


// ======================= Sign Up User =======================
export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  // Check if all inputs empty
  if (!username || !email || !password) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, 'All fields (username, email, password) are required');
    return;
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

// ======================= Sign In User =======================
export const signin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  // Check if all inputs empty
  if (!email || !password) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, 'Email & Password is required');
    return;
  }
  try {
    // Check if user exists
    const user: any = await getItem(userModel, { email });
    if (!user) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, 'User does not exists');
      return;
    }
    const matchedPassword: boolean = await user.isPasswordMatched(password);
    // Check the password if it is correct password
    if(!matchedPassword) {
      handleResponseError(res, HttpStatusCode.UNAUTHORIZED, 'Wrong credentials');
      return;
    }
    // Create JWT token
    const token: string | JwtPayload = await generateToken(user._id)
    // Send cookie with name "access_token" and value is jwt token
    res.cookie('access_token', token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
    const {password: pass, ...rest} = user._doc;
    handleResponseSuccess(res, HttpStatusCode.OK, `User ${user.username} login`, [rest]);
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, err.message);
    return;
  }
});