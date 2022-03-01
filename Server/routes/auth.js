const router = require("express").Router();
const UserModel = require("../models/Users");
const { registerValidation, loginValidation } = require("../helpers/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../helpers/verifyToken");

router.post("/register", async (req, res) => {
  //Validate data before create a user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if user is already in database
  const emailExist = await UserModel.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const hashConfirmPassword = await bcrypt.hash(req.body.confirmpassword, salt);

  //create a new user
  const user = new UserModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    number: req.body.number,
    password: hashPassword,
    confirmpassword: hashConfirmPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking if email exists in database to login
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email not found ");

  // checking if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password entered is incorrect");

  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  //   res.header("auth-token", token).send(token);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  res.send("success!");
});

router.get("/users", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];

    const claims = jwt.verify(cookie, process.env.TOKEN_SECRET);
    if (!claims) {
      return res.status(401).send("unauthenticated");
    }

    const users = await UserModel.findOne({ _id: claims._id });

    const { password, ...data } = await users.toJSON();

    res.send(data);
  } catch (e) {
    return res.status(401).send("unauthenticated");
  }
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send("success");
});

module.exports = router;


