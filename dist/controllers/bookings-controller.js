"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booktrip = booktrip;
exports.getTrips = getTrips;
const user_model_1 = require("../models/user-model");
const mongoose_1 = __importDefault(require("mongoose"));
const global_error_1 = require("../middleware/global-error");
const packages_model_1 = require("../models/packages-model");
const bookings_model_1 = require("../models/bookings-model");
const config_1 = require("../utility/config");
async function booktrip(req, res, next) {
    try {
        const { packageId, userId } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(String(packageId)) ||
            !mongoose_1.default.Types.ObjectId.isValid(String(userId))) {
            throw new global_error_1.CustomError("Unknown IDs", 400);
        }
        const findUser = await user_model_1.USERMODEL.findById({
            _id: userId,
        });
        const findPackage = await packages_model_1.PACKAGESCHEMA.findById({
            _id: packageId,
        });
        if (!findUser || !findPackage) {
            throw new global_error_1.CustomError("User or Package not found!", 400);
        }
        const result = await bookings_model_1.BOOKINGSSCHEMA.create({
            userId,
            packageId,
        });
        if (!result) {
            throw new global_error_1.CustomError("Something wrong with booking, please try again later.", 400);
        }
        const response = {
            message: "Your trip was successfully booked.",
            statuscode: 200,
            success: true,
            responses: result,
        };
        config_1.transport
            .sendMail({
            from: "pinbarajan.official@gmail.com",
            to: findUser.email,
            subject: "Congratulations your booking was successfully created.",
            html: `
        <h1>Thanks for booking with us.</h1>
        <p>your trip from ${findPackage.from} to ${findPackage.to} on date ${findPackage.start_date} have been confired.
        <i>Happy Journey ❤️</i>
        `,
        })
            .then(() => {
            res.status(response.statuscode).json(response);
        })
            .catch((err) => {
            next(err);
        });
        await packages_model_1.PACKAGESCHEMA.findByIdAndUpdate(packageId, {
            $push: { booking_ids: userId },
        });
    }
    catch (error) {
        next(error);
    }
}
async function getTrips(req, res, next) {
    try {
        const find = await bookings_model_1.BOOKINGSSCHEMA.find().populate({
            path: "packageId userId",
            select: "-__v -password -googleId",
        });
        const counts = await bookings_model_1.BOOKINGSSCHEMA.countDocuments();
        const result = {
            message: "Successfully fetched bookings",
            statuscode: 200,
            success: true,
            responses: {
                data: find,
                count: counts,
            },
        };
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
