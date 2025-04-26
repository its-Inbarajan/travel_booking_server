import { NextFunction, Request, Response } from "express";
import { CustomError } from "./global-error";
import { verify } from "jsonwebtoken";

export async function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authToken } = req.cookies;

    if (!authToken) {
      throw new CustomError("Token not found", 404, false);
    }

    const decode = verify(authToken, "JWT_SECRET_KEY") as {
      exp: number;
      iat: number;
    };

    if (decode.exp * 1000 < Date.now()) {
      res.clearCookie("authToken", {
        path: "/",
        // domain: "yourdomain.com",
        secure: true,
        httpOnly: true,
      });

      throw new CustomError("Token has expired", 400, false);
    }
    next();
  } catch (error) {
    next(error);
  }
}
