import { Request, Response, NextFunction } from "express";
import { USERMODEL } from "../models/user-model";
import { compare, hash } from "bcrypt";
import { IApiResponse } from "../@types/apiResponse";
import { IUserType } from "../@types/usersType";
import { CustomError } from "../middleware/global-error";
import mongoose from "mongoose";
import { generateOTP, generateToken } from "../utility/helper";
import { transport } from "../utility/config";
import { OTPSCHEMA } from "../models/otp-model";
import { OAuth2Client } from "google-auth-library";
import { sign } from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password, user_name, user_type }: IUserType = req.body;

  // const { profile }: IUserType = req.file;
  try {
    const isExist = await USERMODEL.findOne({ email: email });

    if (isExist) {
      throw new CustomError("Give email is already exist.", 400, false);
    }

    const hashed = await hash(password as string, 10);
    const user = await USERMODEL.create({
      email,
      password: hashed,
      user_name,
      user_type,
      provider: "local",
      // profile`
    });

    if (!user) {
      const apiErrRes: IApiResponse<null> = {
        message: "Somethign went wrong!",
        statuscode: 400,
        success: false,
      };

      res.status(apiErrRes.statuscode).json(apiErrRes);
    }

    const result: IApiResponse<IUserType> = {
      message: `Thansk for sign with us ${user_name}.`,
      responses: user,
      statuscode: 201,
      success: true,
    };

    // Initizile mail with opt
    const otp = generateOTP();
    const hashOtp = await hash(otp, 10);
    // console.log(otp);
    const createOtp = await OTPSCHEMA.create({
      otp: hashOtp,
      userId: user?._id,
    });

    if (!createOtp) {
      throw new CustomError("Otp is not created.", 400, false);
    } else {
      await transport
        .sendMail({
          from: "pinbarajan.official@gmail.com",
          to: email,
          subject: "Please verify your account by using otp",
          text: `Please find the opt, reminder don't share with anyone ${otp}`,
        })
        .then(() => res.status(result.statuscode).json(result))
        .catch((err) => {
          next(err);
        });
    }
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  try {
    const find_user = await USERMODEL.findOne({ email: email });

    if (!find_user) {
      throw new CustomError("User is not found", 404, false);
    }

    const camparePass = await compare(password, find_user?.password!);

    if (!camparePass) {
      throw new CustomError("Password is not match.", 400, false);
    }

    const token = generateToken({
      data: {
        user_type: find_user.user_type,
        userId: new mongoose.Types.ObjectId(find_user._id as string),
      },
    });

    const responses: IApiResponse<IUserType> = {
      message: `Welcome ${find_user.user_name ?? ""}`,
      statuscode: 200,
      success: true,
      responses: find_user,
    };

    // Store token in HTTP-Only cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: (process.env.NODE_ENV! as string) === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(responses.statuscode).json(responses);
  } catch (error) {
    next(error);
  }
}

export async function loginWithGoogle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { idToken } = req.body;
  try {
    if (!idToken) {
      throw new CustomError("Id Token is missing", 400);
    }

    const userTicket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = userTicket.getPayload();
    if (!payload) {
      throw new CustomError("Invalid Google token", 404);
    }
    const { email, name, picture } = payload;

    // Find or create user
    let user = await USERMODEL.findOne({ email });

    if (!user) {
      user = new USERMODEL({
        email,
        user_name: name,
        profile: picture,
        provider: "google", // you can save how the user logged in
      });
      await user.save();
    }

    // Generate your own JWT for the session
    const token = sign(
      { userId: user._id, user_type: user.user_type },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Store token in HTTP-Only cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevents access from JavaScript
      secure: (process.env.NODE_ENV! as string) === "production", // Use secure cookies in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    const result: IApiResponse<IUserType> = {
      message: "Login successfull",
      statuscode: 200,
      success: true,
      responses: user,
    };

    res.status(result.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
    const findUser = await USERMODEL.findById(id);

    if (!findUser) {
      throw new CustomError("User not found!", 404);
    }

    const response = await USERMODEL.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    if (!response) {
      throw new CustomError(
        "Something wrong with Update, please try again later.",
        400
      );
    }

    const result: IApiResponse<IUserType> = {
      message: "Profile Updated successfully!",
      statuscode: 200,
      success: true,
      responses: response,
    };

    res.status(result.statuscode).json(result);
  } catch (error) {
    next(error);
  }
}
