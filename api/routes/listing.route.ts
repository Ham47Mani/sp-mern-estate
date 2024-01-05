import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createListing, deleteListing, updateListing } from "../controllers/listing.controller";

const listingRouter: Router  = Router();

listingRouter.post("/create", authMiddleware, createListing);// Create a listing
listingRouter.put("/update/:id", authMiddleware, updateListing);// Update a listing
listingRouter.delete("/delete/:id", authMiddleware, deleteListing);// Delete a listing

export default listingRouter;