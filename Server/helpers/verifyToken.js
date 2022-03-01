const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");

module.exports = async function (req, res, next) {
  const { userID } = req.body;
  const user = await UserModel.findById(userID);
  if (!user?.admin)
    return res.status(401).send("Access Denied (As not admin) ");
  try {
    const verified = user?.admin;
    req.user = verified;
    next();
  } catch (err) {
    res.send(err);
  }
};
