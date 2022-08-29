const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getNotifications,
  removeNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/:id", protect, getNotifications);
router.patch("/:id", protect, removeNotifications);

module.exports = router;
