const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  console.log(req.body, "printitng body");
  console.log(req.headers, "printing headers");
  console.log(req.params, "printing params");
  const Token = req.headers.authheader || req.params.authheader;
  console.log(Token, "printing Token");
  const userID = req.header.userid || req.params.userid;
  console.log(userID, "UserID");

  console.log(userID);
  if (Token) {
    jwt.verify(Token, process.env.JWT_SEC, (err, user) => {
      if (err)
        res
          .status(403)
          .json({ message: "Token is not valid and cannot be verified!" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do this operation");
    }
  });
};

module.exports = {
  verifytoken,
  verifyTokenAndAdmin,
};
