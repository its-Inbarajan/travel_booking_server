import mongoose, { Document, Schema } from "mongoose";
import { IUserType } from "../@types/usersType";

const User_schema = new Schema<IUserType>(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
    },
    profile: {
      type: String,
      default: "",
    },
    user_name: {
      type: String,
      required: [true, "User name is required"],
    },
    isVerifyed: {
      type: Boolean,
      default: false,
    },
    user_type: {
      type: String,
      enum: ["admin", "user"],
    },
    googleId: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

export const USERMODEL = mongoose.model<IUserType>("User", User_schema);
