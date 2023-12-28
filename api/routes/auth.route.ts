import { Router } from "express";
import { signInWithGoogle, signin, signup } from "../controllers/auth.controller";

const authRouter: Router  = Router();

authRouter.post("/sigup", signup);// Register user
authRouter.post("/sigin", signin);// Login user
authRouter.post("/google", signInWithGoogle);// Register user info getting from google auth

export default authRouter;