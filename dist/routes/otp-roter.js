"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_controller_1 = require("../controllers/otp-controller");
const otpsRouter = (0, express_1.Router)();
otpsRouter.put("/verifyOtp", otp_controller_1.verifyOtp);
otpsRouter.post("/sendOtp", otp_controller_1.sendOtp);
exports.default = otpsRouter;
