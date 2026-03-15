import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    vehicle: {
      type: String,
      required: true,
      trim: true
    },
    plate: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    eta: {
      type: Number,
      required: true
    },
    rideType: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["available", "busy"],
      default: "available"
    }
  },
  {
    timestamps: true
  }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
