import { Router } from "express";
import { deleteUser, getUser, getUserListings, updateUserInfo } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter: Router  = Router();

userRouter.put("/update/:id", authMiddleware, updateUserInfo);// Update user information
userRouter.delete("/delete/:id", authMiddleware, deleteUser);// Delete user
userRouter.get("/listings", authMiddleware, getUserListings);// Get user listings
userRouter.get("/:id", authMiddleware, getUser);// Get user info

export default userRouter;