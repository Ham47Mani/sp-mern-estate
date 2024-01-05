import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../utils/costume.type';
import { Response } from 'express';
import { handleResponseError, handleResponseSuccess } from '../utils/handleResponse';
import { HttpStatusCode } from '../utils/httpStatusCodes';
import { LISTING } from '../utils/modale.type';
import { createItem, deleteItem, getItem, updateItem } from '../utils/mongooseCruds';
import listingModel from '../models/listing.model';
import { isValidObjectId } from 'mongoose';

// ======================= Create a Listing =======================
export const createListing = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    // Get listing info from request body & check if all fields sended
    const listingInfo: LISTING = req.body;
    if(!listingInfo.name || !listingInfo.description || !listingInfo.address || !listingInfo.regularPrice || !listingInfo.bathRooms || !listingInfo.badRooms || !listingInfo.type) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, `All fields is required (name, description, address, regularPrice, bathRooms, badRooms, furnished, parking, type, offer)`);
      return;
    }
    listingInfo.userRef= req.user ? req.user.id : ""
    const newListing: LISTING | null = await createItem(listingModel, listingInfo);
    if (!newListing) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, `Create new item error from createListing function`);
      return;
    }
    handleResponseSuccess(res, HttpStatusCode.CREATED, `Listing ${newListing.name} created successfully`, [newListing]);
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.BADREQUEST, err.message);
    return;
  }
});

// ======================= Update a Listing =======================
export const updateListing = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
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
  try {
    // Check if the listing is exists
    const listing: LISTING | null = await getItem(listingModel, {_id: id});
    if(!listing) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, "This listing does not exists");
      return
    }
    if (req.user && String(listing.userRef) !== String(req.user.id)) {
      handleResponseError(res, HttpStatusCode.UNAUTHORIZED, "You can only delete your own listings");
      return
    }
    // Update Listing
    const updatedListing: LISTING | null = await updateItem(listingModel, {_id: id}, {...req.body});
    if(updatedListing) {
      handleResponseSuccess(res, HttpStatusCode.OK, `Listing ${updatedListing.name} updated successfully`, [updatedListing]);
    }
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.INTERNALSERVERERROR, err.message);
  }
});

// ======================= Delete a Listing =======================
export const deleteListing = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
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
  try {
    // Check if the listing is exists
    const listing: LISTING | null = await getItem(listingModel, {_id: id});
    if(!listing) {
      handleResponseError(res, HttpStatusCode.BADREQUEST, "This listing does not exists");
      return
    }
    if (req.user && String(listing.userRef) !== String(req.user.id)) {
      handleResponseError(res, HttpStatusCode.UNAUTHORIZED, "You can only delete your own listings");
      return
    }
    // Delete Listing
    await deleteItem(listingModel, {_id: id});
    handleResponseSuccess(res, HttpStatusCode.OK, `Listing ${listing.name} deleted successfully`, []);
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.INTERNALSERVERERROR, err.message);
  }
});