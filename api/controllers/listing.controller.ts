import asyncHandler from 'express-async-handler';
import { CustomRequest } from '../utils/costume.type';
import { Request, Response } from 'express';
import { handleResponseError, handleResponseSuccess } from '../utils/handleResponse';
import { HttpStatusCode } from '../utils/httpStatusCodes';
import { LISTING } from '../utils/modale.type';
import { createItem, deleteItem, getItem, getItems, updateItem } from '../utils/mongooseCruds';
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

// ======================= Get a single user listing Information =======================
export const getListing = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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
    // Get user listings
    const userListings: LISTING | null = await getItem(listingModel, {_id: id});
    if(!userListings) {
      handleResponseError(res, HttpStatusCode.NOTFOUND, `This listing not exists`);
      return
    }
    handleResponseSuccess(res, HttpStatusCode.OK, `Listing ${userListings.name} : `, [userListings]);
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.INTERNALSERVERERROR, err.message);
  }
});

// ======================= Get all listings Information =======================
export const getListings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Pagination
    const limit: string = req.query.limit ? req.query.limit.toString() : "10";
    const page: string = req.query.page ? req.query.page.toString()  : "1";
    // Sanitize fields
    let offer = (req.query.offer === undefined || Boolean(req.query.offer) === false) ? {$in: [false, true]} : Boolean(req.query.offer);
    let parking = (req.query.parking === undefined || Boolean(req.query.parking) === false) ? {$in: [false, true]} : Boolean(req.query.parking);
    let furnished = (req.query.furnished === "undefined" || Boolean(req.query.furnished) === false) ? {$in: [false, true]} : Boolean(req.query.furnished);
    let type = (req.query.type === undefined || req.query.type === "all") ? {$in: ["rent", "sell"]} : req.query.type?.toString();
    let searchTerm = req.query.searchTerm ? req.query.searchTerm.toString() : "";
    let sort: string = req.query.sort ? req.query.sort.toString() : "";
    
    // Get listings
    const listings: LISTING[] | null = await getItems(listingModel, {
      name: {$regex: searchTerm, $options: 'i'}, offer, parking, furnished, type
    }, sort, "", page, limit);

    if(!listings) {
      handleResponseError(res, HttpStatusCode.NOTFOUND, `There's no listings`);
      return
    }
    handleResponseSuccess(res, HttpStatusCode.OK, `Listings ${listings.length} : `, [...listings]);
  } catch (err: any) {
    handleResponseError(res, HttpStatusCode.INTERNALSERVERERROR, err.message);
  }
});