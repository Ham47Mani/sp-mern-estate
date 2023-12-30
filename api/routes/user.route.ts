import { Router } from "express";
import { deleteUser, updateUserInfo } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter: Router  = Router();

userRouter.put("/update/:id", authMiddleware, updateUserInfo);// Update user information
userRouter.delete("/delete/:id", authMiddleware, deleteUser);// Delete user

export default userRouter;