import mongoose from "mongoose";

const pointSnapshotSchema = new mongoose.Schema(
  {
    name: String,
    x: Number,
    y: Number
  },
  {
    _id: false
  }
);

const rideTypeSnapshotSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    multiplier: Number,
    eta: Number,
    description: String
  },
  {
    _id: false
  }
);

const driverSnapshotSchema = new mongoose.Schema(
  {
    name: String,
    vehicle: String,
    plate: String,
    rating: Number,
    eta: Number,
    rideType: String
  },
  {
    _id: false
  }
);

const bookingSchema = new mongoose.Schema(
  {
    pickup: {
      type: pointSnapshotSchema,
      required: true
    },
    dropoff: {
      type: pointSnapshotSchema,
      required: true
    },
    rideType: {
      type: rideTypeSnapshotSchema,
      required: true
    },
    driver: {
      type: driverSnapshotSchema,
      required: true
    },
    payment: {
      type: String,
      required: true
    },
    tripMode: {
      type: String,
      enum: ["now", "scheduled"],
      default: "now"
    },
    distance: {
      type: Number,
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    fare: {
      type: Number,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "Searching"
    },
    activityLog: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
