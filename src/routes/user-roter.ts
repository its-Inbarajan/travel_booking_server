import { Router } from "express";
import { createUser, login } from "../controllers/user-controller";

const userRouter = Router();

userRouter.post("/create-user", createUser);
userRouter.post("/sign-in", login);

export default userRouter;
