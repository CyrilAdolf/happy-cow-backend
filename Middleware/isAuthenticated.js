const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization) {
    const actualUser = await User.findOne({
      token: req.headers.authorization,
    });

    if (!actualUser) {
      return res.status(401).json("Unauthorized");
    } else {
      req.user = actualUser;
      return next();
    }
  } else {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = isAuthenticated;
