import { Router } from "express";
import {
  createUser,
  login,
  loginWithGoogle,
  updateUser,
} from "../controllers/user-controller";
import { middleware } from "../middleware/middleware";

const userRouter = Router();

userRouter.post("/create-user", createUser);
userRouter.post("/sign-in", login);
userRouter.post("/google", loginWithGoogle);
userRouter.post("/updateUser/:id", middleware, updateUser);

export default userRouter;
