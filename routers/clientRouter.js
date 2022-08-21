const express = require("express");
const {
  getAllClients,
  createClient,
  getClientDetails,
} = require("../controllers/cleintController");
const { protect, checkAccess } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllClients);
router.get("/client/:id", protect, getClientDetails);
router.post("/client", protect, checkAccess, createClient);

module.exports = router;
