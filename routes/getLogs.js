const { verifytoken } = require("./verifyToken");

const User = require("../models/user.model");

const router = require("express").Router();

router.post("/get-logs", verifytoken, async (req, res) => {
  console.log(req.body);
  console.log(req.headers);
  try {
    const { userID } = req.body;

    //checking if user is available in the database
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the logs array from user schema
    // Slice the logs array to latest 10 logs and sort them by date (descending order)
    const logs = user.logs
      .slice(-10)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (logs.length === 0) {
      return res.status(404).json({ message: "No logs found" });
    }

    // Get the weight from the last pushed log object
    const weight = logs[logs.length - 1].weight;

    // Get the LatestGoal object from user schema and extract the goalWeight field
    const latestGoal = user.LatestGoal || {};
    const goalWeight = latestGoal.goalWeight || null;
    const startingWeight = latestGoal.currentWeight || null;

    // Return logs and goal weight along with weight
    return res.status(200).json({
      logs: logs,
      goalWeight: goalWeight,
      LastUpdatedWeight: weight,
      startingWeight,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
