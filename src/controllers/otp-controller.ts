import { NextFunction, Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { CustomError } from "../middleware/global-error";
import { IOtp, OTPSCHEMA } from "../models/otp-model";
import { USERMODEL } from "../models/user-model";
import { IApiResponse } from "../@types/apiResponse";
import { IUserType } from "../@types/usersType";
import { generateOTP } from "../utility/helper";
import { transport } from "../utility/config";

export async function verifyOtp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { otp, userId } = req.body;
  try {
    if (!req.body) {
      throw new CustomError("Empty details is not accpectable.", 400, false);
    }
    const find_user_otp = await OTPSCHEMA.findOne({ userId: userId });

    if (!find_user_otp) {
      throw new CustomError("User details not exist", 404, false);
    }

    const verifyOtp = await compare(otp, find_user_otp?.otp);

    if (!verifyOtp) {
      await OTPSCHEMA.findByIdAndDelete({ _id: find_user_otp?._id });
      throw new CustomError(
        "Opt is not verifyed, please try again later",
        400,
        false
      );
    }

    await USERMODEL.findByIdAndUpdate(
      { _id: userId },
      {
        isVerifyed: true,
      },
      { new: true }
    );

    const response: IApiResponse<IUserType> = {
      message: "OTP verified successfully.",
      statuscode: 200,
      success: true,
    };

    await OTPSCHEMA.findByIdAndDelete({ _id: find_user_otp._id });
    res.status(response.statuscode).json(response);
  } catch (error) {
    next(error);
  }
}

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;

    const findUser = await USERMODEL.findOne({ email: email });

    if (!findUser) {
      throw new CustomError("User not found.", 404, false);
    }

    const otp = generateOTP();

    const hashOtp = await hash(otp, 10);

    const createOtp = await OTPSCHEMA.create({
      otp: hashOtp,
      userId: findUser._id,
    });

    if (!createOtp) {
      await OTPSCHEMA.findByIdAndDelete({ _id: findUser._id });
      throw new CustomError(
        `Opt didn't create, please try again later`,
        400,
        false
      );
    }
    const sendMail = await transport.sendMail({
      from: process.env.MAIL as string,
      to: email,
      subject: `Find your otp ${findUser.user_name}.`,
      text: `Please find the opt, re-minder don't share with anyone ${otp}`,
    });

    if (!sendMail) {
      throw new CustomError("Something wrong with mail smpt", 400, false);
    }

    const result: IApiResponse<IOtp> = {
      message: "please find otp in email inbox.",
      statuscode: 201,
      success: true,
      responses: createOtp,
    };

    res.status(result.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}
