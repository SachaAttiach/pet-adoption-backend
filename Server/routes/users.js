const router = require("express").Router();
const mongoose = require("mongoose");
const UserModel = require("../models/Users");
const verify = require("../helpers/verifyToken");
const { getUserFromRequest } = require("../helpers/auth");

router.get("/getUsers", (req, res) => {
  UserModel.find({}, (err, result) => {
    console.log(result, err);
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

router.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();
  res.json(user);
});

router.get("/getUsers/:userID", async (req, res, next) => {
  const { userID } = req.params;
  try {
    const users = await UserModel.find();
    const elem = users.forEach((elem) => {
      if (elem.id == userID) {
        return res.send({ elem });
      }
    });
  } catch (err) {
    next(err);
  }
});

router.put("/update", async (req, res) => {
  const user = await getUserFromRequest(req);
  for (const [key, value] of Object.entries(req.body)) {
    if (key === "password") {
      console.log("update with encrypted password");
    } else {
      user[key] = value;
    }
  }
  await user.save();
  res.json(user);
});

module.exports = router;
