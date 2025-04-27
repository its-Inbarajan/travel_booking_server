"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.login = login;
exports.loginWithGoogle = loginWithGoogle;
exports.updateUser = updateUser;
const user_model_1 = require("../models/user-model");
const bcrypt_1 = require("bcrypt");
const global_error_1 = require("../middleware/global-error");
const mongoose_1 = __importDefault(require("mongoose"));
const helper_1 = require("../utility/helper");
const config_1 = require("../utility/config");
const otp_model_1 = require("../models/otp-model");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = require("jsonwebtoken");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
async function createUser(req, res, next) {
    const { email, password, user_name, user_type } = req.body;
    // const { profile }: IUserType = req.file;
    try {
        const isExist = await user_model_1.USERMODEL.findOne({ email: email });
        if (isExist) {
            throw new global_error_1.CustomError("Give email is already exist.", 400, false);
        }
        const hashed = await (0, bcrypt_1.hash)(password, 10);
        const user = await user_model_1.USERMODEL.create({
            email,
            password: hashed,
            user_name,
            user_type,
            provider: "local",
            // profile`
        });
        if (!user) {
            const apiErrRes = {
                message: "Somethign went wrong!",
                statuscode: 400,
                success: false,
            };
            res.status(apiErrRes.statuscode).json(apiErrRes);
        }
        const result = {
            message: `Thansk for sign with us ${user_name}.`,
            responses: user,
            statuscode: 201,
            success: true,
        };
        // Initizile mail with opt
        const otp = (0, helper_1.generateOTP)();
        const hashOtp = await (0, bcrypt_1.hash)(otp, 10);
        // console.log(otp);
        const createOtp = await otp_model_1.OTPSCHEMA.create({
            otp: hashOtp,
            userId: user?._id,
        });
        if (!createOtp) {
            throw new global_error_1.CustomError("Otp is not created.", 400, false);
        }
        else {
            await config_1.transport
                .sendMail({
                from: "pinbarajan.official@gmail.com",
                to: email,
                subject: "Please verify your account by using otp",
                text: `Please find the opt, reminder don't share with anyone ${otp}`,
            })
                // .then(() => )
                .catch((err) => {
                next(err);
            });
        }
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        const find_user = await user_model_1.USERMODEL.findOne({ email: email });
        if (!find_user) {
            throw new global_error_1.CustomError("User is not found", 404, false);
        }
        const camparePass = await (0, bcrypt_1.compare)(password, find_user?.password);
        if (!camparePass) {
            throw new global_error_1.CustomError("Password is not match.", 400, false);
        }
        const token = (0, helper_1.generateToken)({
            data: {
                user_type: find_user.user_type,
                userId: new mongoose_1.default.Types.ObjectId(find_user._id),
            },
        });
        const user = {
            email: find_user?.email ?? "",
            user_type: find_user?.user_type ?? "",
            userId: find_user?._id ?? "",
            user_name: find_user?.user_name ?? "",
            profile: find_user.profile ?? "",
        };
        const responses = {
            message: `Welcome ${find_user.user_name ?? ""}`,
            statuscode: 200,
            success: true,
            responses: user,
        };
        // Store token in HTTP-Only cookie
        res.cookie("authToken", token, {
            httpOnly: true, // Prevents access from JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Prevent CSRF attacks
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.status(responses.statuscode).json(responses);
    }
    catch (error) {
        next(error);
    }
}
async function loginWithGoogle(req, res, next) {
    const { idToken } = req.body;
    try {
        if (!idToken) {
            throw new global_error_1.CustomError("Id Token is missing", 400);
        }
        const userTicket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = userTicket.getPayload();
        if (!payload) {
            throw new global_error_1.CustomError("Invalid Google token", 404);
        }
        const { email, name, picture } = payload;
        // Find or create user
        let user = await user_model_1.USERMODEL.findOne({ email });
        if (!user) {
            user = new user_model_1.USERMODEL({
                email,
                user_name: name,
                profile: picture,
                provider: "google", // you can save how the user logged in
            });
            await user.save();
        }
        // Generate your own JWT for the session
        const token = (0, jsonwebtoken_1.sign)({ userId: user._id, user_type: user.user_type }, process.env.JWT_SECRET, { expiresIn: "7d" });
        // Store token in HTTP-Only cookie
        res.cookie("authToken", token, {
            httpOnly: true, // Prevents access from JavaScript
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production
            sameSite: "strict", // Prevent CSRF attacks
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        const result = {
            message: "Login successfull",
            statuscode: 200,
            success: true,
            responses: user,
        };
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
async function updateUser(req, res, next) {
    const { id } = req.params;
    try {
        const findUser = await user_model_1.USERMODEL.findById(id);
        if (!findUser) {
            throw new global_error_1.CustomError("User not found!", 404);
        }
        const response = await user_model_1.USERMODEL.findByIdAndUpdate(id, {
            ...req.body,
        }, { new: true });
        if (!response) {
            throw new global_error_1.CustomError("Something wrong with Update, please try again later.", 400);
        }
        const result = {
            message: "Profile Updated successfully!",
            statuscode: 200,
            success: true,
            responses: response,
        };
        res.status(result.statuscode).json(result);
    }
    catch (error) {
        next(error);
    }
}
