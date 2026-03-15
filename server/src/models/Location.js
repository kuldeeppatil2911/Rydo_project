import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;
