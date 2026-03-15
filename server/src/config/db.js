import mongoose from "mongoose";
import Driver from "../models/Driver.js";
import Location from "../models/Location.js";
import { driverSeeds, locationSeeds } from "../data/seedData.js";

export async function connectDatabase() {
  const { MONGO_URI } = process.env;

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing. Add it to server/.env before starting the backend.");
  }

  await mongoose.connect(MONGO_URI);
  await seedDatabase();
}

async function seedDatabase() {
  const locationCount = await Location.countDocuments();
  const driverCount = await Driver.countDocuments();

  if (!locationCount) {
    await Location.insertMany(locationSeeds);
  }

  if (!driverCount) {
    await Driver.insertMany(driverSeeds);
  }
}
