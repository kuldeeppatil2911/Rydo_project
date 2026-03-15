import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getMe, updateMe } from "../controllers/userController.js";

const router = Router();
router.use(authMiddleware);
router.get("/me", getMe);
router.patch("/me", updateMe);
export default router;
