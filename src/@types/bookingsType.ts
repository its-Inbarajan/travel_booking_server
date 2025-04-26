import mongoose from "mongoose";

export interface IBookings extends Document {
  packageId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}
