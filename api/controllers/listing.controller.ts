import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../utils/costume.type';
import { Response } from 'express';
import { handleResponseError, handleResponseSuccess } from '../utils/handleResponse';
import { HttpStatusCode } from '../utils/httpStatusCodes';
import { LISTING } from '../utils/modale.type';
import { createItem } from '../utils/mongooseCruds';
import listingModel from '../models/listing.model';

// ======================= Update User Information =======================
export const createListing = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Get listing info from request body & check if all fields sended
    const listingInfo: LISTING = req.body;
    if(!listingInfo.name || !listingInfo.description || !listingInfo.address || !listingInfo.regularPrice || !listingInfo.discountPrice || !listingInfo.bathRooms || !listingInfo.badRooms || !listingInfo.furnished || !listingInfo.parking || !listingInfo.type || !listingInfo.offer) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, `All fields is required (name, description, address, regularPrice, discountPrice, discountPrice, bathRomms, badRooms, furnished, parking, type, offer)`);
      return;
    }
    listingInfo.userRef= req.user ? req.user.id : ""
    const newListing: LISTING | null = await createItem(listingModel, listingInfo);
    if (!newListing) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, `Create new item error from createListing function`);
      return;
    }
    handleResponseSuccess(res, HttpStatusCode.OK, `Listing ${newListing.name} created successfully`, [newListing]);
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, err.message);
    return;
  }
});