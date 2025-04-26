import { Types } from "mongoose";
import { sign } from "jsonwebtoken";
interface IToken {
  data: {
    userId: Types.ObjectId;
    user_type: string;
  };
}
export function generateToken(data: IToken) {
  return sign(data, "JWT_SECRET_KEY", {
    expiresIn: "24h",
  });
}

export function generateOTP() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
}
