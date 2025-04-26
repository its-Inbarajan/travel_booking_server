"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = require("../controllers/bookings-controller");
const bookingRouter = (0, express_1.Router)();
bookingRouter.post("/createBooking", bookings_controller_1.booktrip);
bookingRouter.get("/getTrips", bookings_controller_1.getTrips);
exports.default = bookingRouter;
