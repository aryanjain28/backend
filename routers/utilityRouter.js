const express = require("express");
const {
  getOptions,
  getDashboardDetails,
} = require("../controllers/utilityController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/options", protect, getOptions);
router.get("/dashboard", protect, getDashboardDetails);

module.exports = router;
