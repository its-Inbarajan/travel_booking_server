"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
exports.generateToken = generateToken;
exports.generateOTP = generateOTP;
const jsonwebtoken_1 = require("jsonwebtoken");
function generateToken(data) {
    return (0, jsonwebtoken_1.sign)(data, "JWT_SECRET_KEY", {
        expiresIn: "24h",
    });
}
function generateOTP() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString();
}
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.catchAsync = catchAsync;
