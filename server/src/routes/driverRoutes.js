import { Router } from "express";
import { getDrivers } from "../controllers/driverController.js";

const router = Router();

router.get("/", getDrivers);

export default router;
