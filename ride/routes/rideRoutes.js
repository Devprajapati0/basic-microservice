import { Router } from "express";
import autheicator from "../middlewares/auth.middleware.js";
import { createRide ,acceptRide} from "../controller/ride.controller.js";
const router = Router();
// Define the registration route
router.post("/create", autheicator, createRide);
// Define the route to accept a ride
router.post("/acceptride", autheicator, acceptRide);


export default router;