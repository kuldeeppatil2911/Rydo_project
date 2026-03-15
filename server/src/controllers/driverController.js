import Driver from "../models/Driver.js";

export async function getDrivers(req, res, next) {
  try {
    const filter = req.query.rideType ? { rideType: req.query.rideType } : {};
    const drivers = await Driver.find({ ...filter, status: "available" }).sort({ eta: 1, rating: -1 }).lean();
    res.json({ data: drivers });
  } catch (error) {
    next(error);
  }
}
