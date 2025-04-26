import { NextFunction, Request, Response } from "express";
import { IBookings } from "../@types/bookingsType";
import { USERMODEL } from "../models/user-model";
import mongoose, { Types } from "mongoose";
import { CustomError } from "../middleware/global-error";
import { PACKAGESCHEMA } from "../models/packages-model";
import { BOOKINGSSCHEMA } from "../models/bookings-model";
import { IApiResponse } from "../@types/apiResponse";
import { transport } from "../utility/config";

export async function booktrip(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { packageId, userId }: IBookings = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(String(packageId)) ||
      !mongoose.Types.ObjectId.isValid(String(userId))
    ) {
      throw new CustomError("Unknown IDs", 400);
    }
    const findUser = await USERMODEL.findById({
      _id: userId,
    });

    const findPackage = await PACKAGESCHEMA.findById({
      _id: packageId,
    });

    if (!findUser || !findPackage) {
      throw new CustomError("User or Package not found!", 400);
    }

    const result = await BOOKINGSSCHEMA.create({
      userId,
      packageId,
    });

    if (!result) {
      throw new CustomError(
        "Something wrong with booking, please try again later.",
        400
      );
    }

    const response: IApiResponse<IBookings> = {
      message: "Your trip was successfully booked.",
      statuscode: 200,
      success: true,
      responses: result,
    };
    transport
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
    await PACKAGESCHEMA.findByIdAndUpdate(packageId, {
      $push: { booking_ids: userId },
    });
  } catch (error) {
    next(error);
  }
}

export async function getTrips(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const find = await BOOKINGSSCHEMA.find().populate({
      path: "packageId userId",
      select: "-__v -password -googleId",
    });

    const counts = await BOOKINGSSCHEMA.countDocuments();

    const result: IApiResponse<{ data: IBookings[]; count: number }> = {
      message: "Successfully fetched bookings",
      statuscode: 200,
      success: true,
      responses: {
        data: find,
        count: counts,
      },
    };

    res.status(result.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}
