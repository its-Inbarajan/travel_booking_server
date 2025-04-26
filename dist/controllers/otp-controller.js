"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = verifyOtp;
exports.sendOtp = sendOtp;
const bcrypt_1 = require("bcrypt");
const global_error_1 = require("../middleware/global-error");
const otp_model_1 = require("../models/otp-model");
const user_model_1 = require("../models/user-model");
const helper_1 = require("../utility/helper");
const config_1 = require("../utility/config");
async function verifyOtp(req, res, next) {
    const { otp, userId } = req.body;
    try {
        if (!req.body) {
            throw new global_error_1.CustomError("Empty details is not accpectable.", 400, false);
        }
        const find_user_otp = await otp_model_1.OTPSCHEMA.findOne({ userId: userId });
        if (!find_user_otp) {
            throw new global_error_1.CustomError("User details not exist", 404, false);
        }
        const verifyOtp = await (0, bcrypt_1.compare)(otp, find_user_otp?.otp);
        if (!verifyOtp) {
            await otp_model_1.OTPSCHEMA.findByIdAndDelete({ _id: find_user_otp?._id });
            throw new global_error_1.CustomError("Opt is not verifyed, please try again later", 400, false);
        }
        await user_model_1.USERMODEL.findByIdAndUpdate({ _id: userId }, {
            isVerifyed: true,
        }, { new: true });
        const response = {
            message: "OTP verified successfully.",
            statuscode: 200,
            success: true,
        };
        await otp_model_1.OTPSCHEMA.findByIdAndDelete({ _id: find_user_otp._id });
        res.status(response.statuscode).json(response);
    }
    catch (error) {
        next(error);
    }
}
async function sendOtp(req, res, next) {
    try {
        const { email } = req.body;
        const findUser = await user_model_1.USERMODEL.findOne({ email: email });
        if (!findUser) {
            throw new global_error_1.CustomError("User not found.", 404, false);
        }
        const otp = (0, helper_1.generateOTP)();
        const hashOtp = await (0, bcrypt_1.hash)(otp, 10);
        const createOtp = await otp_model_1.OTPSCHEMA.create({
            otp: hashOtp,
            userId: findUser._id,
        });
        if (!createOtp) {
            await otp_model_1.OTPSCHEMA.findByIdAndDelete({ _id: findUser._id });
            throw new global_error_1.CustomError(`Opt didn't create, please try again later`, 400, false);
        }
        const sendMail = await config_1.transport.sendMail({
            from: process.env.MAIL,
            to: email,
            subject: `Find your otp ${findUser.user_name}.`,
            text: `Please find the opt, re-minder don't share with anyone ${otp}`,
        });
        if (!sendMail) {
            throw new global_error_1.CustomError("Something wrong with mail smpt", 400, false);
        }
        const result = {
            message: "please find otp in email inbox.",
            statuscode: 201,
            success: true,
            responses: createOtp,
        };
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
