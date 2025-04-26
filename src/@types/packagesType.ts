import mongoose from "mongoose";

export interface IPackages extends Document {
  from: string;
  to: string;
  start_date: string;
  end_date: string;
  base_price: string;
  accommondation: string;
  posted_by: mongoose.Schema.Types.ObjectId;
  package_name: string;
  _id: string;
  status: string;
  booking_ids: mongoose.Schema.Types.ObjectId[];
}
