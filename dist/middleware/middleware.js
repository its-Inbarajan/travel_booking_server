"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const global_error_1 = require("./global-error");
const jsonwebtoken_1 = require("jsonwebtoken");
async function middleware(req, res, next) {
    try {
        const { authToken } = req.cookies;
        if (!authToken) {
            throw new global_error_1.CustomError("Token not found", 404, false);
        }
        const decode = (0, jsonwebtoken_1.verify)(authToken, "JWT_SECRET_KEY");
        if (decode.exp * 1000 < Date.now()) {
            res.clearCookie("authToken", {
                path: "/",
                // domain: "yourdomain.com",
                secure: true,
                httpOnly: true,
            });
            throw new global_error_1.CustomError("Token has expired", 400, false);
        }
        next();
    }
    catch (error) {
        next(error);
    }
}
