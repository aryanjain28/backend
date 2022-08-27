const express = require("express");
const {
  getUserDetails,
  registerUser,
  loginUser,
  getAllUsers,
  newAccessToken
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user/:userId", protect, getUserDetails);
router.post("/user/login", loginUser);
router.post("/user/signUp", registerUser);
router.get("/", protect, getAllUsers);
router.post("/user/token",newAccessToken);

module.exports = router;
