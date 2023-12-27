import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller";

const authRouter: Router  = Router();

authRouter.post("/sigup", signup);// Register user
authRouter.post("/sigin", signin);// Login user

export default authRouter;