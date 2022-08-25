const express = require("express");
const { getOptions } = require("../controllers/utilityController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/options", protect, getOptions);

module.exports = router;
