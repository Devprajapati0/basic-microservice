import { Router } from "express";
import { register,login,logout,profile } from "../controller/user.controller.js";
import autheicator from "../middlewares/auth.middleware.js";
const router = Router();
// Define the registration route
router.post("/register", register);
// Define the login route
router.post("/login", login);
// Define the logout route
router.post("/logout", logout);
// Define the profile route
router.get("/profile",autheicator, profile);

export default router;