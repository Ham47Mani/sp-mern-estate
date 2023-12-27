import { Router } from "express";
import { signup } from "../controllers/auth.controller";

const authRouter: Router  = Router();

authRouter.post("/sigup", signup);// Register user

export default authRouter;