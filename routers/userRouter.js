const express = require("express");
const {
  getUserDetails,
  registerUser,
  loginUser,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user", protect, getUserDetails);
router.post("/user/login", loginUser);
router.post("/user/signUp", registerUser);

module.exports = router;
