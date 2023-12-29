import { Response } from "express";
import asyncHandler from "express-async-handler";
import { CustomRequest } from "../utils/costume.type";
import { handleResponseError, handleResponseSuccess } from "../utils/handleResponse";
import { HttpStatusCode } from "../utils/httpStatusCodes";
import { isValidObjectId } from "mongoose";
import { USER } from "../utils/modale.type";
import { updateItem } from "../utils/mongooseCruds";
import userModel from "../models/user.model";
import { hashPassword } from "../utils/bcrypt.util";


// ======================= Update User Information =======================
export const updateUserInfo = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  const {id} = req.params;
  // Check if 'id' not exists
  if(!id) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, "ID is required");
    return
  }
  // Check if id is valid
  if(!isValidObjectId(id)) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, "This 'id' is not valid");
    return
  }
  // Check if user authenticate is the same with the id
  if(req.user && req?.user.id !== id) {
    handleResponseError(res, HttpStatusCode.UNAUTHORIZED, "You can only update your own account");
    return
  }
  try {
    // Get info from request body
    const {username, email, password, photo} = req.body;
    let hashedPassword = req?.user?.password;
    if(password) {
      hashedPassword = await hashPassword(password);
    }
    // Update user
    const updatedUser: any = await updateItem(userModel, {_id: id}, {
      $set: {username, email, password: hashedPassword, photo}
    });
    if(updatedUser) {
      const {password, ...userOtherInfo} = updatedUser._doc;
      handleResponseSuccess(res, HttpStatusCode.OK, `User ${updatedUser.username} is updated successfully`, [userOtherInfo]);
      return
    }
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.INTERNALSERVERERROR, err.message);
  }
});