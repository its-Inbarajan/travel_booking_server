import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transport = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL! ?? "pinbarajan.official@gmail.com",
    pass: process.env.MAIL_PASS! ?? "psaq bbtc zahr iitc",
    // user: "pinbarajan.official@gmail.com",
    // pass: "psaq bbtc zahr iitc",
  },
});
