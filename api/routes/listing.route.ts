import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createListing } from "../controllers/listing.controller";

const listingRouter: Router  = Router();

listingRouter.post("/create", authMiddleware, createListing);// Create a listing

export default listingRouter;