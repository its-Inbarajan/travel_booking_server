import dot from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieparser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user-roter";
import otpsRouter from "./routes/otp-roter";
import packageRouter from "./routes/packages-router";
import bookingRouter from "./routes/booking-router";
import { GlobalError } from "./middleware/global-error";

// Config
dot.config();
const app = express();

// cors
const allowedOrigins = [
  "https://travel-booking-client-4r4p.vercel.app",
  "http://localhost:8000",
];
app.use(
  cors({
    methods: ["POST", "GET", "PUT", "DELETE"],
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieparser());

// app.use("/api", (req: Request, res: Response) => {
//   res.send("Welcome developer! your server is Perfectly running.");
// });

// Global error handler
app.use(GlobalError);

// apis
app.use("/api/v1/users", userRouter);
app.use("/api/v1/otps", otpsRouter);
app.use("/api/v1/package", packageRouter);
app.use("/api/v1/bookings", bookingRouter);

mongoose
  .connect(process.env.MONGODB_URL! as string)
  .then(() => {
    app.listen(process.env.PORT! as string, () => {
      console.log(`Server running on http://localhost:${process.env.PORT!}`);
    });
  })
  .catch((error: unknown) => {
    console.log(error);
  });
