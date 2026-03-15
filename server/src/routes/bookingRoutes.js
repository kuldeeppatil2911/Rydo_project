import { Router } from "express";
import {
  createBookingController,
  estimateBooking,
  getRecentBookings,
  updateBookingStatusController
} from "../controllers/bookingController.js";

const router = Router();

router.get("/recent", getRecentBookings);
router.post("/estimate", estimateBooking);
router.post("/", createBookingController);
router.patch("/:bookingId/status", updateBookingStatusController);

export default router;
