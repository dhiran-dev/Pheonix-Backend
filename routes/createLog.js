const { verifytoken } = require("./verifyToken");

const User = require("../models/user.model");

const router = require("express").Router();

//CREATE LATEST GOAL
router.post("/create-log", verifytoken, async (req, res) => {
  try {
    const { userID, CalorieIntake, Intermittent, caloriesBurnt, date, weight } =
      req.body;

    //checking if user is available in the database
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has a log inside the logs array of user schema, if available push the object into array
    const logs = user.logs || [];
    const existingLog = logs.find((log) => log.date === date);

    if (existingLog) {
      return res
        .status(400)
        .json({ message: "Only one log can be created for a date selected" });
    } else {
      logs.push({
        CalorieIntake,
        Intermittent,
        caloriesBurnt,
        date,
        weight,
      });

      await User.updateOne({ _id: userID }, { logs });

      return res.status(200).json({ message: "Log created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
