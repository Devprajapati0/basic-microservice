import { Router } from "express";
import { register,login,logout,profile,isAvailble,waitForNewRide } from "../controller/captain.controller.js";
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
// Define the availability route
router.post("/isAvailable", autheicator, isAvailble);
// Define the route to wait for new ride requests
router.get("/newride", autheicator, waitForNewRide);



export default router;