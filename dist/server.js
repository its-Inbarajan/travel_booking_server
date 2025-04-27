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
// Config
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// cors
app.use((0, cors_1.default)({
    origin: "http://localhost:8000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
}));
// app.use("/api", (req: Request, res: Response) => {
//   res.send("Welcome developer! your server is Perfectly running.");
// });
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
