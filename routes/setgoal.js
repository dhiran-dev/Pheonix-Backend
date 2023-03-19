const { verifytoken } = require("./verifyToken");

const User = require("../models/user.model");

const router = require("express").Router();

//CREATE LATEST GOAL
router.post("/latest-goal", verifytoken, async (req, res) => {
  try {
    const {
      userID,
      maintainanceCal,
      goalCalories,
      goalWeight,
      currentWeight,
      rate,
    } = req.body;

    //checking if user is available in the database
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a Latest Goal object
    if (user.LatestGoal) {
      return res
        .status(400)
        .json({ message: "Latest Goal already exists for this user" });
    }

    // Create a new Latest Goal for the user
    user.LatestGoal = {
      maintainanceCal,
      goalCalories,
      goalWeight,
      currentWeight,
      rate,
    };
    await user.save();
    res
      .status(201)
      .json({ LatestGoal: user.LatestGoal, message: "Goal set successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
