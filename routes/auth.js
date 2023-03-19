const router = require("express").Router();
const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// password: req.body.userPassword,
//REGISTER USER
router.post("/signup", async (req, res) => {
  try {
    const userdata = await User.create({
      email: req.body.userEmail,
      password: CryptoJS.AES.encrypt(
        req.body.userPassword,
        process.env.PASS_SEC
      ).toString(),
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

//LOGIN USER
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.userEmail });
  !user && res.status(401).json("Wrong Username!");

  const hashedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASS_SEC
  );
  const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  if (OriginalPassword !== req.body.userPassword) {
    return res.status(401).json("Wrong Password!");
  }

  if (!user) {
    res.status(401).json("Email or Password is incorrect");
  } else {
    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3h" }
    );
    const { password, LatestGoal, logs, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
    console.log(user);
  }
});

module.exports = router;
