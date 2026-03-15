import Driver from "../models/Driver.js";
import Location from "../models/Location.js";
import { rideTypes } from "../data/seedData.js";

export async function getMetaPayload() {
  const locations = await Location.find().sort({ order: 1 }).lean();
  return { locations, rideTypes };
}

export async function buildTripEstimate({ pickupName, dropoffName, rideTypeId, tripMode }) {
  const [pickup, dropoff] = await Promise.all([
    Location.findOne({ name: pickupName }).lean(),
    Location.findOne({ name: dropoffName }).lean()
  ]);

  if (!pickup || !dropoff) {
    throw new Error("Pickup or drop-off location was not found.");
  }

  if (pickup.name === dropoff.name) {
    throw new Error("Pickup and drop-off must be different.");
  }

  const rideType = rideTypes.find((item) => item.id === rideTypeId);
  if (!rideType) {
    throw new Error("Selected ride type is invalid.");
  }

  const dx = dropoff.x - pickup.x;
  const dy = dropoff.y - pickup.y;
  const distance = Math.max(Math.sqrt((dx ** 2) + (dy ** 2)) * 0.18, 1.6);
  const demandFactor = tripMode === "scheduled" ? 0.95 : 1.08;
  const time = Math.round((distance * 2) + rideType.eta + 1);
  const fare = Math.round((65 + (distance * 18) + (time * 2.4)) * rideType.multiplier * demandFactor);

  return {
    pickup: snapshotLocation(pickup),
    dropoff: snapshotLocation(dropoff),
    rideType,
    distance,
    time,
    fare
  };
}

export async function findBestDriver(rideTypeId) {
  const matchingDriver = await Driver.findOne({ rideType: rideTypeId, status: "available" })
    .sort({ eta: 1, rating: -1 })
    .lean();

  const fallbackDriver = matchingDriver || await Driver.findOne({ status: "available" }).sort({ eta: 1, rating: -1 }).lean();

  if (!fallbackDriver) {
    throw new Error("No drivers are currently available.");
  }

  return snapshotDriver(fallbackDriver);
}

export function createOtp() {
  return String(Math.floor(1000 + (Math.random() * 9000)));
}

export function snapshotDriver(driver) {
  return {
    name: driver.name,
    vehicle: driver.vehicle,
    plate: driver.plate,
    rating: driver.rating,
    eta: driver.eta,
    rideType: driver.rideType
  };
}

export function snapshotLocation(location) {
  return {
    name: location.name,
    x: location.x,
    y: location.y
  };
}
