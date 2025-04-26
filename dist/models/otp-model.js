"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPSCHEMA = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    otp: {
        type: String,
        required: [true, "Otp is required."],
    },
    userId: {
        type: String,
        ref: "User",
        required: [true, "userId is required."],
    },
}, { timestamps: true });
exports.OTPSCHEMA = (0, mongoose_1.model)("otps", otpSchema);
