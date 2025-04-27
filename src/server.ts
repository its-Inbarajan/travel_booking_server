import dot from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieparser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user-roter";
import otpsRouter from "./routes/otp-roter";
import packageRouter from "./routes/packages-router";
import bookingRouter from "./routes/booking-router";

// Config
dot.config();
const app = express();
app.use(express.json());
app.use(cookieparser());

// cors
app.use(
  cors({
    origin: "http://localhost:8000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use("/api", (req: Request, res: Response) => {
//   res.send("Welcome developer! your server is Perfectly running.");
// });

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
