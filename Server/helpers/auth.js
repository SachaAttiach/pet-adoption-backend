const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users");

const getUserFromRequest = async (req) => {
  const claims = jwt.verify(req.cookies.jwt, process.env.TOKEN_SECRET);
  return await UserModel.findById(claims._id);
};

module.exports = {
  getUserFromRequest,
};
