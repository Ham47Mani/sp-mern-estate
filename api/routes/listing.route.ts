import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createListing, deleteListing } from "../controllers/listing.controller";

const listingRouter: Router  = Router();

listingRouter.post("/create", authMiddleware, createListing);// Create a listing
listingRouter.delete("/delete/:id", authMiddleware, deleteListing);// Delete a listing

export default listingRouter;