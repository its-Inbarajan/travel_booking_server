import { Router } from "express";
import {
  createPackage,
  deletePackages,
  getPackage,
  getPackageById,
  getPackages,
  updatePackage,
} from "../controllers/packages-controller";

const packageRouter = Router();

packageRouter.post("/createPackage", createPackage);
packageRouter.get("/getPackages", getPackages);
packageRouter.put("/updatePackage/:id", updatePackage);
packageRouter.delete("/deletePackages/:id", deletePackages);
packageRouter.get("/getById/:id", getPackage);

export default packageRouter;
