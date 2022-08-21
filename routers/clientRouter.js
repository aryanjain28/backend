const express = require("express");
const {
  getAllClients,
  createClient,
} = require("../controllers/cleintController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllClients);
router.post("/client", protect, checkAccess, createClient);

module.exports = router;
