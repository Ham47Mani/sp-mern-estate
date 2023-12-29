import { Router } from "express";
import { updateUserInfo } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRouter: Router  = Router();

userRouter.put("/update/:id", authMiddleware, updateUserInfo);// Update user information

export default userRouter;