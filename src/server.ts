import dot from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cookieparser from "cookie-parser";
import cors from "cors";

// Config
dot.config();
const app = express();
app.use(express.json());
app.use(cookieparser());

// cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/", (req: Request, res: Response) => {
  res.send("Welcome developer! your server is Perfectly running.");
});

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
