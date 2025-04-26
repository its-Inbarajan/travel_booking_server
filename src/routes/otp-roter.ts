import { Router } from "express";
import { sendOtp, verifyOtp } from "../controllers/otp-controller";

const otpsRouter = Router();

otpsRouter.put("/verifyOtp", verifyOtp);
otpsRouter.post("/sendOtp", sendOtp);

export default otpsRouter;
