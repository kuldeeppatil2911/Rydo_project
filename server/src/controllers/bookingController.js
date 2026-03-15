import Booking from "../models/Booking.js";
import { buildTripEstimate, createOtp, findBestDriver } from "../services/tripService.js";

export async function estimateBooking(req, res, next) {
  try {
    const data = await buildTripEstimate({
      pickupName: req.body.pickup,
      dropoffName: req.body.dropoff,
      rideTypeId: req.body.rideType,
      tripMode: req.body.tripMode
    });

    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function createBookingController(req, res, next) {
  try {
    const estimate = await buildTripEstimate({
      pickupName: req.body.pickup,
      dropoffName: req.body.dropoff,
      rideTypeId: req.body.rideType,
      tripMode: req.body.tripMode
    });

    const driver = await findBestDriver(req.body.rideType);
    const booking = await Booking.create({
      ...estimate,
      driver,
      payment: req.body.payment,
      tripMode: req.body.tripMode,
      otp: createOtp(),
      status: "Searching",
      activityLog: [
        `Ride booked from ${estimate.pickup.name} to ${estimate.dropoff.name}.`,
        `Fare estimate locked at Rs. ${estimate.fare} via ${req.body.payment}.`,
        `Driver ${driver.name} is being connected to your request.`
      ]
    });

    res.status(201).json({ data: booking });
  } catch (error) {
    next(error);
  }
}

export async function updateBookingStatusController(req, res, next) {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    booking.status = req.body.status;
    booking.activityLog.unshift(`${req.body.status} at ${new Date().toISOString()}`);
    await booking.save();

    return res.json({ data: booking });
  } catch (error) {
    return next(error);
  }
}

export async function getRecentBookings(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 4;
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json({ data: bookings });
  } catch (error) {
    next(error);
  }
}
