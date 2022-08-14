const express = require("express");
const { getAllClients } = require("../controllers/cleintController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllClients);

module.exports = router;
