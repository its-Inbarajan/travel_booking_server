import mongoose, { model, Schema } from "mongoose";
import { IBookings } from "../@types/bookingsType";

const bookingSchema = new Schema<IBookings>(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "package",
      required: [true, "Package id is missing."],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User id is required."],
    },
  },
  { timestamps: true }
);

export const BOOKINGSSCHEMA = model("bookings", bookingSchema);
