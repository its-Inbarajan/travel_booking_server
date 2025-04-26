"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode, success = false) {
        super(message);
        this.statusCode = statusCode;
        this.success = success;
        // Ensure the error stack trace is captured
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const GlobalError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const success = err.success || false;
    const stack = err.stack;
    res.status(statusCode).json({
        success,
        message: err.message || "Internal Server Error",
        statusCode,
        stack,
    });
};
exports.GlobalError = GlobalError;
