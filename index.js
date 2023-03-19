const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const goalRoute = require("./routes/setgoal");
const logRoute = require("./routes/createLog");
const getLogRoute = require("./routes/getLogs");

const PORT = process.env.PORT || 8080;

// const User = require("./models/user.model");
// const jwt = require("jsonwebtoken");
dotenv.config();
app.use(cors());
app.use(express.json());

// mongoose
//   .connect("mongodb://localhost:27017/phoenix")
//   .then(() => console.log("Database connected"))
//   .catch((err) => console.log(err));

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.use("/api/auth", authRoute);
app.use("/api/goal", goalRoute);
app.use("/api/logs", logRoute);
app.use("/api/refreshlogs", getLogRoute);

// app.listen(8080, () => {
//   console.log("Backend Server started on 8080");
// });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log((`Listening on port ${PORT}`))
  })
})