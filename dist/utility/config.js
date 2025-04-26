"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.transport = (0, nodemailer_1.createTransport)({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.MAIL ?? "pinbarajan.official@gmail.com",
        pass: process.env.MAIL_PASS ?? "psaq bbtc zahr iitc",
        // user: "pinbarajan.official@gmail.com",
        // pass: "psaq bbtc zahr iitc",
    },
});
