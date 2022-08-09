const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asynHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc Login User
// @route POST /users/user/login
// @access Public
const loginUser = asynHandler(async (req, res) => {
  const { email, password } = req.body.data;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ status: 404, message: "User does not exist." });
    throw new Error("User does not exist.");
  }

  if (await bcrypt.compare(password, user.password)) {
    res.status(200).json({
      status: 200,
      message: "User Logged in Successfully",
      data: {
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid Credentials." });
    throw new Error("Invalid Credentials.");
  }
});

// @desc Register New User
// @route POST /users/user/signUp
// @access Public
const registerUser = asynHandler(async (req, res) => {
  const { fName, lName, email, password } = req.body.data;

  if (!fName || !lName || !email || !password) {
    res.status(400).json({ status: 400, message: "All fields are required." });
    throw new Error("Please add all the required fields.");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ status: 400, message: "User already exists." });
    throw new Error("User already exists.");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    fName,
    lName,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      status: 201,
      message: "User Create Successfully",
      data: {
        _id: user.id,
        fName,
        lName,
        email,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid User." });
    throw new Error("Invalid User.");
  }
});

// @desc get User details
// @route GET /users/user
// @access Private
const getUserDetails = asynHandler(async (req, res) => {
  res.json({ status: 200, data: req.user, message: "User Details" });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  loginUser,
  getUserDetails,
  registerUser,
};
