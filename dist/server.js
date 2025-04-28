"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_roter_1 = __importDefault(require("./routes/user-roter"));
const otp_roter_1 = __importDefault(require("./routes/otp-roter"));
const packages_router_1 = __importDefault(require("./routes/packages-router"));
const booking_router_1 = __importDefault(require("./routes/booking-router"));
const global_error_1 = require("./middleware/global-error");
// Config
dotenv_1.default.config();
const app = (0, express_1.default)();
// cors
const allowedOrigins = [
    "http://localhost:3000",
    "https://travel-booking-client-4r4p.vercel.app",
];
app.use((0, cors_1.default)({
    methods: ["POST", "GET", "PUT", "DELETE"],
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("CORS not allowed"));
        }
    },
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use("/api", (req: Request, res: Response) => {
//   res.send("Welcome developer! your server is Perfectly running.");
// });
// Global error handler
app.use(global_error_1.GlobalError);
// apis
app.use("/api/v1/users", user_roter_1.default);
app.use("/api/v1/otps", otp_roter_1.default);
app.use("/api/v1/package", packages_router_1.default);
app.use("/api/v1/bookings", booking_router_1.default);
mongoose_1.default
    .connect(process.env.MONGODB_URL)
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
})
    .catch((error) => {
    console.log(error);
});
