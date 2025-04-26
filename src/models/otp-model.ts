import { Document, Schema, model } from "mongoose";

export interface IOtp extends Document {
  otp: string;
  userId: string;
}

const otpSchema = new Schema<IOtp>(
  {
    otp: {
      type: String,
      required: [true, "Otp is required."],
    },
    userId: {
      type: String,
      ref: "User",
      required: [true, "userId is required."],
    },
  },
  { timestamps: true }
);

export const OTPSCHEMA = model("otps", otpSchema);
