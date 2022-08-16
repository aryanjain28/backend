const express = require("express");
const {
  getUserDetails,
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user/:userId", protect, getUserDetails);
router.post("/user/login", loginUser);
router.post("/user/signUp", registerUser);
router.get("/", protect, getAllUsers);

module.exports = router;
