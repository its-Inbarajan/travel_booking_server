import mongoose, { model, Schema } from "mongoose";
import { IPackages } from "../@types/packagesType";

const packageSchema = new Schema<IPackages>(
  {
    accommondation: {
      tpye: String,
      //   required: [true, "Accommondation must be filled!"],
    },
    base_price: {
      type: String,
      required: [true, "Price must be filled."],
    },
    end_date: {
      type: String,
      required: [true, "End Date must be filled."],
    },
    from: {
      type: String,
      required: [true, "From Desiganation must be filled."],
    },
    start_date: {
      type: String,
      required: [true, "Start Date must be filled."],
    },
    to: {
      type: String,
      required: [true, "To Desiganation must be filled."],
    },
    package_name: {
      type: String,
      required: [true, "Package name must be filled."],
    },
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Creator id missing."],
    },
    booking_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

export const PACKAGESCHEMA = model("package", packageSchema);
