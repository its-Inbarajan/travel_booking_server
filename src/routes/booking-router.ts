import { Router } from "express";
import { booktrip, getTrips } from "../controllers/bookings-controller";

const bookingRouter = Router();

bookingRouter.post("/createBooking", booktrip);
bookingRouter.get("/getTrips", getTrips);

export default bookingRouter;
