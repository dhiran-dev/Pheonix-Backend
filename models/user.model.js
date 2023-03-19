const mongoose = require("mongoose");

const LatestGoal = new mongoose.Schema({
  maintainanceCal: { type: String },
  goalCalories: { type: Number },
  goalWeight: { type: Number },
  currentWeight: { type: String },
  rate: { type: String },
});

const logs = new mongoose.Schema({
  CalorieIntake: { type: String },
  Intermittent: { type: String },
  caloriesBurnt: { type: String },
  date: { type: String },
  weight: { type: String },
});

const User = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    LatestGoal: LatestGoal,
    logs: [logs],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { collection: "user-collection" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
